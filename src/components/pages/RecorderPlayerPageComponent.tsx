import * as React from "react";
import * as Radium from "radium";
import {RecorderNote} from "../RecorderNote";
import {IYoutubeVideoPlayer, VideoPlayer} from "../VideoPlayer";
import {AudioOutputHelper} from "../../AudioOutputHelper";
import {NoteInfoList} from "../../models/NoteInfoList";
import {SingleNotePlayer} from "../../SingleNotePlayer";
import {ITotalNoteState, makeNewITotalNoteState, NoteKeyboardManager} from "../../NoteKeyboardManager";
import {INoteInfo} from "../../models/INoteInfo";
import {ChangeEvent} from "react";
import {ICompositionNote} from "../../models/ICompositionNote";
import {ICompositionState} from "../../models/ICompositionState";
import {IComposition} from "../../models/IComposition";
import {ButtonFont, GlobalFont} from "../../styles/GlobalStyles";
import * as color from "color";

const axios = require("axios");

@Radium
export class RecorderPlayerPageComponent extends React.Component<IRecorderPlayerPageComponentProps, IRecorderPlayerPageComponentState> {
    props: IRecorderPlayerPageComponentProps;
    state: IRecorderPlayerPageComponentState;

    audioOutputHelper: Promise<AudioOutputHelper>;
    singleNotePlayer: SingleNotePlayer;
    noteKeyboardManager: NoteKeyboardManager;
    video: IYoutubeVideoPlayer;

    stopPlayingTimeout: NodeJS.Timer;

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
            youtubeVideoId: "",
            stateName: RecorderStateName.Loading,
            recordingYoutubeStartTime: -1,
            recordingYoutubeEndTime: -1,
            hasRecorded: false,
            recording: [],
            startRecordingDateTime: -1,
            err: null
        };

        this.audioOutputHelper = AudioOutputHelper.getInstance(NoteInfoList.notes);
        this.singleNotePlayer = new SingleNotePlayer();
        this.noteKeyboardManager = new NoteKeyboardManager(NoteInfoList.notes);

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
        return this.state.noteState.down.filter(down => down.note.name === note.name).length === 1;
    }

    private onVideoReady(event) {
        console.log("video ready");

        this.video = event.target as IYoutubeVideoPlayer;
    }

    private onStateChange(event) {
        console.log(event);
        if (event.data == -1) {
            this.video.playVideo();
            setTimeout(() => {
                this.video.pauseVideo();
                console.log("I should play and pause");
            }, 1);
        }
    }

    render() {
        console.log("rendering...");
        console.log(this.state);
        return (
            <div style={[
                RecorderPlayerPageComponent.styles.base,
                RecorderPlayerPageComponent.styles.flex
            ]}>
                <div>
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

                        <input
                            style={[
                                ButtonFont,
                                RecorderPlayerPageComponent.styles.flex,
                                RecorderPlayerPageComponent.styles.button
                            ]}
                            key="0"
                            type="button"
                            value="record"
                            onClick={this.record.bind(this)}
                            disabled={this.props.viewOnly || this.state.stateName !== RecorderStateName.FreePlay}/>
                        <input
                            style={[
                                ButtonFont,
                                RecorderPlayerPageComponent.styles.flex,
                                RecorderPlayerPageComponent.styles.button
                            ]}
                            key="1"
                            type="button"
                            value="stop recording"
                            onClick={this.stopRecording.bind(this)}
                            disabled={this.props.viewOnly || this.state.stateName !== RecorderStateName.Recording}/>
                        <input
                            style={[
                                ButtonFont,
                                RecorderPlayerPageComponent.styles.flex,
                                RecorderPlayerPageComponent.styles.button
                            ]}
                            key="2"

                            type="button"
                            value="play back"
                            onClick={this.play.bind(this)}
                            disabled={this.state.stateName !== RecorderStateName.FreePlay || !this.state.hasRecorded}/>
                        <input
                            style={[
                                ButtonFont,
                                RecorderPlayerPageComponent.styles.flex,
                                RecorderPlayerPageComponent.styles.button
                            ]}
                            key="3"
                            type="button"
                            value="stop play back"
                            onClick={this.stopPlayback.bind(this)}
                            disabled={this.state.stateName !== RecorderStateName.Playing}/>
                        <input
                            style={[
                                ButtonFont,
                                RecorderPlayerPageComponent.styles.flex,
                                RecorderPlayerPageComponent.styles.button
                            ]}
                            key="4"
                            type="button"
                            value="reset"
                            onClick={this.reset.bind(this)}
                            disabled={this.props.viewOnly || this.state.stateName !== RecorderStateName.FreePlay}/>
                        <input
                            style={[
                                ButtonFont,
                                RecorderPlayerPageComponent.styles.flex,
                                RecorderPlayerPageComponent.styles.button
                            ]}
                            key="5"
                            type="button"
                            value="save"
                            onClick={this.save.bind(this)}
                            disabled={this.props.viewOnly || this.state.stateName !== RecorderStateName.FreePlay}/>

                    </div>

                    <br/>
                    <div style={[
                        RecorderPlayerPageComponent.styles.flex,
                        RecorderPlayerPageComponent.styles.noteContainer
                    ]}>
                        {
                            NoteInfoList.notes.filter(note => note.isFlat).map((note, i) => {
                                return <RecorderNote key={i} note={note} isDown={this.isNoteDown(note)}/>;
                            })
                        }
                    </div>
                    <div style={[
                        RecorderPlayerPageComponent.styles.flex,
                        RecorderPlayerPageComponent.styles.noteContainer
                    ]}>
                        {
                            NoteInfoList.notes.filter(note => !note.isFlat).map((note, i) => {
                                return <RecorderNote key={i} note={note} isDown={this.isNoteDown(note)}/>;
                            })
                        }
                    </div>
                    <br/>
                    <div style={[
                        GlobalFont,
                        RecorderPlayerPageComponent.styles.flex
                    ]}>
                        <label>
                            <span>current youtube id: {this.state.youtubeVideoId}</span>
                            <input style={[RecorderPlayerPageComponent.styles.youtubeIdInput]}
                                   ref="youtubeInput"
                                   type="text"/>
                            <input type="button"
                                   value="change video id"
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
                            canInteract={this.state.stateName == RecorderStateName.FreePlay}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private handleVideoIdChange() {
        if (this.state.stateName === RecorderStateName.FreePlay) {
            console.log("changing state");
            this.setState({
                youtubeVideoId: this.refs.youtubeInput.value
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
                recording: this.state.noteState.played.slice()
            });
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
            }, (this.state.recordingYoutubeEndTime - this.state.recordingYoutubeStartTime) * 1000);

            this.video.seekTo(this.state.recordingYoutubeStartTime);
            this.video.playVideo();

            this.audioOutputHelper.then(helper => {
                helper.playListOfNotes(this.state.startRecordingDateTime, this.state.recording);
            });
        }
    }

    private save() {
        if (this.state.stateName == RecorderStateName.FreePlay) {
            this.setState({
                stateName: RecorderStateName.Saving
            });

            axios.post(`/recorder/${this.props.editToken}/save`, this.getUploadableComposition())
                .then((result) => {
                    console.log("save complete");
                    this.setState({
                        stateName: RecorderStateName.FreePlay
                    });
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        err: err as any
                    });
                });
        }
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
                console.log(result);
                console.log(compositionState);
                this.setState({
                    stateName: RecorderStateName.FreePlay,
                    youtubeVideoId: compositionState.youtubeVideoId,
                    noteState: makeNewITotalNoteState(),
                    recordingYoutubeStartTime: compositionState.recordingYoutubeStartTime,
                    recordingYoutubeEndTime: compositionState.recordingYoutubeEndTime,
                    startRecordingDateTime: compositionState.startRecordingDateTime,
                    hasRecorded: compositionState.hasRecorded,
                    recording: compositionState.notes,
                    err: null
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    err: err as any
                });
            });
    }

    private getUploadableComposition(): ICompositionState {
        let compositionState = {
            compName: "",
            youtubeVideoId: this.state.youtubeVideoId,
            recordingYoutubeStartTime: this.state.recordingYoutubeStartTime,
            recordingYoutubeEndTime: this.state.recordingYoutubeEndTime,
            startRecordingDateTime: this.state.startRecordingDateTime,
            hasRecorded: this.state.hasRecorded,
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
        noteContainer: {
            width: "100%",
            height: "100px"
        },
        buttonContainer: {
            width: "100%"
        },
        button: {
            border: "none",
            padding: "20px",
            margin: "20px",
            fontSize: "1.5em",
            cursor: "pointer",
            backgroundColor: color(RecorderPlayerPageComponent.buttonColor).hex(),
            ":hover": {
                backgroundColor: color(RecorderPlayerPageComponent.buttonColor).darken(0.5).hex()
            },
            ":disabled": {
                backgroundColor: color(RecorderPlayerPageComponent.buttonColor).lighten(0.2).hex(),
                cursor: "initial",
            }
        },
        youtubeIdInput: {
            padding: "10px 10px 10px 10px",
            borderRadius: "4px",
            transition: "200ms",
            border: "1px solid rgb(200, 200, 200)",
            outline: "none",
            margin: "20px",
            ":focus": {
                boxShadow: "inset 0px 0px 4px rgba(0,0,0,0.5)"
            }
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
    recording: ICompositionNote[];
    err: Error;
}

export enum RecorderStateName {
    FreePlay = "free_play",
    Recording = "recording",
    Playing = "playing",
    Saving = "saving",
    Loading = "loading",
}