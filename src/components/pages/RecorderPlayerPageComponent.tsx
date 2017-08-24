import * as React from "react";
import * as Radium from "radium";
import {RecorderNote} from "../RecorderNote";
import {IYoutubeVideoPlayer, VideoPlayer} from "../VideoPlayer";
import {AudioOutputHelper} from "../../AudioOutputHelper";
import {NoteInfoList} from "../../models/NoteInfoList";
import {SingleNotePlayer} from "../../SingleNotePlayer";
import {ITotalNoteState, makeNewITotalNoteState, NoteKeyboardManager} from "../../NoteKeyboardManager";
import {INoteInfo} from "../../models/INoteInfo";
import {ICompositionNote} from "../../models/ICompositionNote";
import {ICompositionState} from "../../models/ICompositionState";
import {ButtonFont, GlobalFont, TitleFont} from "../../styles/GlobalStyles";
import * as color from "color";
import {ShareComponent} from "../ShareComponent";
import {getINoteInfoForPositionIndex, NoteUIPositionList} from "../../models/NoteUIPositionList";
import * as Tooltip from 'rc-tooltip';
import * as ReactTooltip from 'react-tooltip'

const axios = require("axios");
const getYoutubeId = require("get-youtube-id");


@Radium
export class RecorderPlayerPageComponent extends React.Component<IRecorderPlayerPageComponentProps, IRecorderPlayerPageComponentState> {
    props: IRecorderPlayerPageComponentProps;
    state: IRecorderPlayerPageComponentState;

    audioOutputHelper: Promise<AudioOutputHelper>;
    singleNotePlayer: SingleNotePlayer;
    noteKeyboardManager: NoteKeyboardManager;
    video: IYoutubeVideoPlayer;

    stopPlayingTimeout: NodeJS.Timer;

    audioOutputStopper: {stop: () => void};

    refs: {
        youtubeInput: HTMLInputElement
    };

    constructor(props: IRecorderPlayerPageComponentProps) {
        super();

        this.state = {
            noteState: {
                down: [],
                played: []
            },
            youtubeVideoId: "HQnC1UHBvWA",
            stateName: RecorderStateName.Loading,
            recordingYoutubeStartTime: -1,
            recordingYoutubeEndTime: -1,
            hasRecorded: false,
            autoRecorded: false,
            recording: [],
            startRecordingDateTime: -1,
            lastEdited: -1,
            viewCount: 0,
            err: null,
            canInteract: true
        };

        this.audioOutputHelper = AudioOutputHelper.getInstance(NoteInfoList.notes);
        this.singleNotePlayer = new SingleNotePlayer();
        this.noteKeyboardManager = new NoteKeyboardManager(NoteInfoList.notes, 0);

        this.noteKeyboardManager.attachListeners();

        this.noteKeyboardManager.on(NoteKeyboardManager.NOTE_START, (note: INoteInfo) => {
            this.audioOutputHelper.then(helper => {
                this.singleNotePlayer.playNote(helper, note);
            });
        });

        this.noteKeyboardManager.on(NoteKeyboardManager.NOTE_END, (note: INoteInfo) => {
            this.audioOutputHelper.then(helper => {
                this.singleNotePlayer.stopNote(helper, note);
            });
        });

        this.noteKeyboardManager.on(NoteKeyboardManager.STATE_CHANGED, (state: ITotalNoteState) => {
            this.setState({
                noteState: state
            });
        });

        setTimeout(() => {
            console.log("attempting to load data");
            this.loadData();
        }, 0);
    }

    private isNoteDown(note: INoteInfo): boolean {
        if (!note) {
            return false;
        }
        return this.state.noteState.down.filter(down => down.note.name === note.name).length === 1;
    }

    private onVideoReady(event) {
        console.log("video ready");

        this.video = event.target as IYoutubeVideoPlayer;

        this.video.playVideo();
        setTimeout(() => {
            this.video.pauseVideo();
        }, 5);
    }

    private onStateChange(event) {
        if (event.data == 5) { // we want to play/pause when video cued
            this.video.playVideo();
            setTimeout(() => {
                this.video.pauseVideo();
            }, 5);
        }
    }

    render() {
        console.log("rendering...");
        console.log(this.state);

        let playDisabled: boolean = this.state.stateName !== RecorderStateName.Playing;
        let stopPlayDisabled: boolean = this.state.stateName !== RecorderStateName.FreePlay || !this.state.hasRecorded;

        const stopOrPlayButton = this.state.stateName === RecorderStateName.Playing ? (
                <button
                    style={[
                    ButtonFont,
                    RecorderPlayerPageComponent.styles.flex,
                    RecorderPlayerPageComponent.styles.button
                ]}
                    key="3"
                    type="button"
                    value="stop play back"
                    onClick={this.stopPlayback.bind(this)}
                    disabled={playDisabled}
                    data-tip="stop playback">
                    <i className="fa fa-stop" aria-hidden="true"></i>
                </button>
            ) : (
                <button
                    style={[
                    ButtonFont,
                    RecorderPlayerPageComponent.styles.flex,
                    RecorderPlayerPageComponent.styles.button
                ]}
                    key="2"
                    type="button"
                    value="play back"
                    onClick={this.play.bind(this)}
                    disabled={stopPlayDisabled}
                    data-tip="play back">
                    <i className="fa fa-play" aria-hidden="true"></i>
                </button>
            );

        let recordDisabled: boolean = this.props.viewOnly || this.state.stateName !== RecorderStateName.Recording;
        let stopRecordDisabled: boolean = this.props.viewOnly || this.state.stateName !== RecorderStateName.FreePlay;

        const recordOrStopRecordingButton = this.state.stateName === RecorderStateName.Recording ? (
                <button
                    style={[
                    ButtonFont,
                    RecorderPlayerPageComponent.styles.flex,
                    RecorderPlayerPageComponent.styles.button
                ]}
                    key="1"
                    type="button"
                    value="stop recording"
                    onClick={this.stopRecording.bind(this)}
                    disabled={recordDisabled}
                    data-tip="stop recording">
                    <i className="fa fa-stop" aria-hidden="true"></i>
                </button>
            ) : (
                <button
                    style={[
                    ButtonFont,
                    RecorderPlayerPageComponent.styles.flex,
                    RecorderPlayerPageComponent.styles.button
                ]}
                    key="0"
                    type="button"
                    value="record"
                    onClick={this.record.bind(this)}
                    disabled={stopRecordDisabled}
                    data-tip="record">
                    <i className="fa fa-circle" aria-hidden="true"></i>
                </button>
            );


        return (
            <div style={[
                RecorderPlayerPageComponent.styles.base,
                RecorderPlayerPageComponent.styles.flex
            ]}>
                {
                    !this.state.canInteract ?
                        <div style={[
                            TitleFont,
                            RecorderPlayerPageComponent.styles.overlay
                        ]}>
                            flootifying for you...
                        </div> :
                        null
                }
                <div>
                    {
                        this.props.viewOnly ? null : (
                                <div style={[RecorderPlayerPageComponent.styles.flex]}>
                                    <ShareComponent viewToken={this.props.viewToken}/>
                                </div>
                            )
                    }


                    <div style={[
                        RecorderPlayerPageComponent.styles.flex,
                        RecorderPlayerPageComponent.styles.buttonContainer
                    ]}>
                        {/*<div>*/}
                        {/*youtubeVideoId: {this.state.youtubeVideoId} <br/>*/}
                        {/*state: {this.state.stateName} <br/>*/}
                        {/*record start: {this.state.recordingYoutubeStartTime} <br/>*/}
                        {/*record end: {this.state.recordingYoutubeEndTime} <br/>*/}
                        {/*has recorded: {this.state.hasRecorded.toString()} <br/>*/}
                        {/*notes recorded: {this.state.recording.length} <br/>*/}
                        {/*start offset: {this.state.startRecordingDateTime} <br/>*/}
                        {/*</div>*/}

                        <br/>

                            <ReactTooltip place="top" type="dark" effect="solid" delayHide={1}/>
                            {recordOrStopRecordingButton}
                            <ReactTooltip place="top" type="dark" effect="solid" delayHide={1}/>
                            {stopOrPlayButton}
                            <ReactTooltip place="top" type="dark" effect="solid" delayHide={1}/>

                        <button
                            style={[
                                ButtonFont,
                                RecorderPlayerPageComponent.styles.flex,
                                RecorderPlayerPageComponent.styles.button
                            ]}
                            key="4"
                            type="button"
                            value="reset"
                            onClick={this.reset.bind(this)}
                            disabled={!this.state.hasRecorded || this.props.viewOnly || this.state.stateName !== RecorderStateName.FreePlay}
                            data-tip="reset">
                            <i className="fa fa-eraser" aria-hidden="true"></i>
                        </button>
                        <ReactTooltip place="top" type="dark" effect="solid" delayHide={1}/>
                        <button
                            style={[
                                ButtonFont,
                                RecorderPlayerPageComponent.styles.flex,
                                RecorderPlayerPageComponent.styles.button
                            ]}
                            key="5"
                            type="button"
                            value="save"
                            onClick={this.save.bind(this)}
                            disabled={!this.state.hasRecorded || this.props.viewOnly || this.state.stateName !== RecorderStateName.FreePlay}
                            data-tip="save">
                            <i className="fa fa-floppy-o" aria-hidden="true"></i>
                        </button>
                        <ReactTooltip place="top" type="dark" effect="solid" delayHide={1}/>
                        {/*<button*/}
                        {/*style={[*/}
                        {/*ButtonFont,*/}
                        {/*RecorderPlayerPageComponent.styles.flex,*/}
                        {/*RecorderPlayerPageComponent.styles.button*/}
                        {/*]}*/}
                        {/*key="6"*/}
                        {/*type="button"*/}
                        {/*value="flootify"*/}
                        {/*onClick={this.flootify.bind(this)}*/}
                        {/*disabled={this.props.viewOnly || this.state.stateName !== RecorderStateName.FreePlay}>*/}
                        {/*<i className="fa fa-floppy-o" aria-hidden="true"></i>*/}
                        {/*</button>*/}

                    </div>

                    <br/>

                    <div style={[
                        RecorderPlayerPageComponent.styles.flex,
                        RecorderPlayerPageComponent.styles.keyboardContainer
                    ]}>
                        <div style={[
                            RecorderPlayerPageComponent.styles.flexCol,
                            RecorderPlayerPageComponent.styles.pitchButtonsContainer
                        ]}>
                            <button
                                style={[
                                    ButtonFont,
                                    RecorderPlayerPageComponent.styles.flex,
                                    RecorderPlayerPageComponent.styles.button
                                ]}
                                key="7"
                                type="button"
                                value="^"
                                onClick={this.pitchUp.bind(this)}
                                disabled={this.noteKeyboardManager.pitchShift >= 11 || this.state.stateName !== RecorderStateName.FreePlay}>
                                <i className="fa fa-long-arrow-up" aria-hidden="true"></i>
                            </button>
                            <button
                                style={[
                                    ButtonFont,
                                    RecorderPlayerPageComponent.styles.flex,
                                    RecorderPlayerPageComponent.styles.button
                                ]}
                                key="8"
                                type="button"
                                value="v"
                                onClick={this.pitchDown.bind(this)}
                                disabled={this.noteKeyboardManager.pitchShift <= 0 || this.state.stateName !== RecorderStateName.FreePlay}>
                                <i className="fa fa-long-arrow-down" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div>
                            <div style={[
                                RecorderPlayerPageComponent.styles.flex,
                                RecorderPlayerPageComponent.styles.noteContainer
                            ]}>
                                {
                                    NoteUIPositionList.minorRow.notePositions.map((notePos, i) => {
                                        let note = getINoteInfoForPositionIndex(notePos.index, this.noteKeyboardManager.pitchShift, notePos.isDummy);
                                        return <RecorderNote key={i} note={note} notePosition={notePos}
                                                             isDown={this.isNoteDown(note)}
                                                             isDummy={notePos.isDummy || note.noteId == -1}/>;
                                    })
                                }
                            </div>
                            <div style={[
                                RecorderPlayerPageComponent.styles.flex,
                                RecorderPlayerPageComponent.styles.noteContainer
                            ]}>
                                {
                                    NoteUIPositionList.majorRow.notePositions.map((notePos, i) => {
                                        let note = getINoteInfoForPositionIndex(notePos.index, this.noteKeyboardManager.pitchShift, notePos.isDummy);
                                        return <RecorderNote key={i} note={note} notePosition={notePos}
                                                             isDown={this.isNoteDown(note)}
                                                             isDummy={notePos.isDummy || note.noteId == -1}/>;
                                    })
                                }
                            </div>
                        </div>
                    </div>


                    <br/>
                    <div style={[
                        GlobalFont,
                        RecorderPlayerPageComponent.styles.flex
                    ]}>
                        <label>
                            <span>YouTube URL:</span>
                            <input style={[RecorderPlayerPageComponent.styles.youtubeIdInput]}
                                   ref="youtubeInput"
                                   type="text"
                                   placeholder={"Paste URL here!"}/>
                            <input type="button"
                                   value="Change Video"
                                   disabled={this.state.stateName !== RecorderStateName.FreePlay}
                                   onClick={this.handleVideoIdChange.bind(this)}/>
                        </label>
                    </div>

                    <div style={[
                        RecorderPlayerPageComponent.styles.flex
                    ]}>
                        <VideoPlayer
                            videoId={this.state.youtubeVideoId}
                            onVideoReady={this.onVideoReady.bind(this)}
                            onStateChange={this.onStateChange.bind(this)}
                            canInteract={this.canVideoPlayerInteract()}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private canVideoPlayerInteract(): boolean {
        return (this.state.stateName == RecorderStateName.FreePlay) && !this.props.viewOnly;
    }

    private handleVideoIdChange() {
        if (this.state.stateName === RecorderStateName.FreePlay) {
            let videoId = getYoutubeId(this.refs.youtubeInput.value);
            if (videoId == null) {
                videoId = "";
            }
            this.setState({
                youtubeVideoId: videoId
            });
        }
    }

    private reset() {
        if (this.state.stateName === RecorderStateName.FreePlay) {
            this.noteKeyboardManager.clearPlayedNotes();
            this.setState({
                recordingYoutubeStartTime: 0,
                recordingYoutubeEndTime: 0,
                stateName: RecorderStateName.FreePlay,
                hasRecorded: false,
                recording: [],
                startRecordingDateTime: 0
            });
        }
    }

    private record() {
        if (this.state.stateName === RecorderStateName.FreePlay) {
            this.reset();
            this.setState({
                stateName: RecorderStateName.Recording,
                recordingYoutubeStartTime: this.video.getCurrentTime(),
                startRecordingDateTime: new Date().getTime()
            });
            this.video.playVideo();
        }
    }

    private stopRecording() {
        if (this.state.stateName === RecorderStateName.Recording) {
            this.setState({
                stateName: RecorderStateName.FreePlay,
                recordingYoutubeEndTime: this.video.getCurrentTime(),
                hasRecorded: true,
                recording: this.state.noteState.played.slice(),
                lastEdited: Date.now()
            }, () => this.save());
            this.video.pauseVideo();
            this.video.seekTo(this.state.recordingYoutubeStartTime);
        }
    }

    private play() {
        if (this.state.stateName === RecorderStateName.FreePlay && this.state.hasRecorded) {
            this.setState({
                stateName: RecorderStateName.Playing
            });

            this.stopPlayingTimeout = setTimeout(() => {
                this.stopPlayingTimeout = null;
                this.stopPlayback();
            }, (this.state.recordingYoutubeEndTime - this.state.recordingYoutubeStartTime) * 1000) as any;

            this.video.seekTo(this.state.recordingYoutubeStartTime);
            this.video.playVideo();

            this.audioOutputHelper.then(helper => {
                this.audioOutputStopper = helper.playListOfNotes(this.state.startRecordingDateTime, this.state.recording);
            });
        }
    }

    private save(): Promise<void> {
        if (this.state.stateName == RecorderStateName.FreePlay) {
            this.setState({
                stateName: RecorderStateName.Saving,
                lastEdited: Date.now()
            });

            axios.post(`/recorder/${this.props.editToken}/save`, this.getUploadableComposition())
                .then((result) => {
                    console.log("save complete");
                    this.setState({
                        stateName: RecorderStateName.FreePlay
                    });
                    return Promise.resolve();
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        err: err as any
                    });
                });
        }
        return Promise.resolve();
    }

    private flootify() {
        this.setState({
            canInteract: false
        });
        let query = `/flootify/${this.state.youtubeVideoId}`;
        console.log("sending flootify query...");
        axios.get(query)
            .then((result) => {
                console.log("here's the result i got back:");
                console.log(result);
                let compositionState = result.data as ICompositionState;
                console.log("load complete");
                this.updateWithCompositionState(compositionState);
            })
            .then(() => {
                return this.save();
            })
            .then(() => {
                window.location.href = "/recorder/view/" + this.props.viewToken;
            })
            .catch(err => {
                console.log(err);
                Promise.reject(err);
            });
    }

    private pitchUp() {
        if (this.state.stateName === RecorderStateName.FreePlay) {
            this.noteKeyboardManager.pitchShift += 1;
        }
        this.setState(this.state); // force re-render
    }

    private pitchDown() {
        if (this.state.stateName === RecorderStateName.FreePlay) {
            this.noteKeyboardManager.pitchShift -= 1;
        }
        this.setState(this.state); // force re-render
    }

    private loadData() {
        let query: string = "";
        if (this.props.viewOnly) {
            query = `/recorder/view/${this.props.viewToken}/data`;
        } else {
            query = `/recorder/${this.props.editToken}/data`;
        }
        axios.get(query)
            .then((result) => {
                console.log("here's the result i got back:");
                console.log(result);
                let compositionState = result.data as ICompositionState;
                console.log("load complete");
                this.updateWithCompositionState(compositionState);
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    err: err as any
                });
            });
    }

    private updateWithCompositionState(compositionState: ICompositionState) {
        this.setState({
            stateName: RecorderStateName.FreePlay,
            youtubeVideoId: compositionState.youtubeVideoId,
            noteState: makeNewITotalNoteState(),
            recordingYoutubeStartTime: compositionState.recordingYoutubeStartTime,
            recordingYoutubeEndTime: compositionState.recordingYoutubeEndTime,
            startRecordingDateTime: compositionState.startRecordingDateTime,
            hasRecorded: compositionState.hasRecorded,
            autoRecorded: compositionState.autoRecorded,
            lastEdited: compositionState.lastEdited,
            viewCount: compositionState.viewCount,
            recording: compositionState.notes,
            err: null
        });
        this.noteKeyboardManager.pitchShift = compositionState.pitchShift;
    }

    private getUploadableComposition(): ICompositionState {
        let compositionState = {
            compName: "",
            youtubeVideoId: this.state.youtubeVideoId,
            recordingYoutubeStartTime: this.state.recordingYoutubeStartTime,
            recordingYoutubeEndTime: this.state.recordingYoutubeEndTime,
            startRecordingDateTime: this.state.startRecordingDateTime,
            hasRecorded: this.state.hasRecorded,
            autoRecorded: this.state.autoRecorded,
            lastEdited: this.state.lastEdited,
            viewCount: this.state.viewCount,
            pitchShift: this.noteKeyboardManager.pitchShift,
            notes: this.state.recording
        };
        return compositionState as ICompositionState;
    }

    private stopPlayback() {
        if (this.state.stateName === RecorderStateName.Playing) {
            this.setState({
                stateName: RecorderStateName.FreePlay
            });

            this.video.seekTo(this.state.recordingYoutubeStartTime);
            this.video.pauseVideo();

            if (this.stopPlayingTimeout) {
                clearTimeout(this.stopPlayingTimeout);
            }

            if (this.audioOutputStopper) {
                this.audioOutputStopper.stop();
                this.audioOutputStopper = null;
            }
        }
    }

    private static readonly buttonColor = "rgb(192, 192, 192)";
    private static styles = {
        base: {
            width: "100vw",
            height: "100vh"
        },
        flex: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row"
        },
        flexCol: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
        },
        pitchButtonsContainer: {
            width: "15%",
            height: "200px"
        },
        noteContainer: {
            width: "100%",
            height: "100px"
        },
        keyboardContainer: {
            width: "100%",
            height: "200px"
        },
        buttonContainer: {
            width: "100%"
        },
        button: {
            border: "none",
            padding: "15px",
            margin: "15px",
            fontSize: "0.8em",
            cursor: "pointer",
            backgroundColor: color(RecorderPlayerPageComponent.buttonColor).hex(),
            ":hover": {
                backgroundColor: color(RecorderPlayerPageComponent.buttonColor).darken(0.5).hex()
            },
            ":disabled": {
                backgroundColor: color(RecorderPlayerPageComponent.buttonColor).lighten(0.2).hex(),
                cursor: "initial"
            }
        },
        youtubeIdInput: {
            width: "300px",
            padding: "10px 10px 10px 10px",
            borderRadius: "4px",
            transition: "200ms",
            border: "1px solid rgb(200, 200, 200)",
            outline: "none",
            margin: "20px",
            ":focus": {
                boxShadow: "inset 0px 0px 4px rgba(0,0,0,0.5)"
            }
        },
        overlay: {
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "black",
            backgroundColor: "rgba(255, 255, 255, 0.8)"
        }
    };
}

export interface IRecorderPlayerPageComponentProps {
    editToken?: string;
    viewToken?: string;
    viewOnly: boolean;
}

export interface IRecorderPlayerPageComponentState {
    stateName: RecorderStateName;
    youtubeVideoId: string;
    noteState: ITotalNoteState;
    recordingYoutubeStartTime: number;
    recordingYoutubeEndTime: number;
    startRecordingDateTime: number;
    hasRecorded: boolean;
    autoRecorded: boolean;
    lastEdited: number;
    viewCount: number;
    recording: ICompositionNote[];
    err: Error;
    canInteract: boolean;
}

export enum RecorderStateName {
    FreePlay = "free_play",
    Recording = "recording",
    Playing = "playing",
    Saving = "saving",
    Loading = "loading",
}