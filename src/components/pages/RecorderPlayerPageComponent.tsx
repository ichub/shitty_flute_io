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
import {TitleFont} from "../../styles/GlobalStyles";
import * as color from "color";
import {ShareComponent} from "../ShareComponent";
import {getINoteInfoForPositionIndex, NoteUIPositionList} from "../../models/NoteUIPositionList";
import * as ReactModal from "react-modal";
import {ControllerBarComponent} from "../ControllerBarComponent";

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

    audioOutputStopper: { stop: () => void };

    refs: {
        youtubeInput: HTMLInputElement,
    };

    constructor(props: IRecorderPlayerPageComponentProps) {
        super();

        setInterval(() => {
            if (this.state.stateName === RecorderStateName.Recording || this.state.stateName === RecorderStateName.Playing) {
                this.setState({
                    videoPosition: (typeof this.video === 'undefined' ? 1 : this.video.getCurrentTime()),
                });
                if (this.video.getCurrentTime() >= this.state.recordingYoutubeEndTime) {
                    this.stopRecording();

                }
            }
            // get the video position, call this.setState({videoPosition: the one you got})
        }, 100);

        this.state = {
            noteState: {
                down: [],
                played: []
            },
            youtubeVideoId: "FHG2oizTlpY",
            stateName: RecorderStateName.Loading,
            recordingYoutubeStartTime: 0,
            recordingYoutubeEndTime: 1,
            hasRecorded: false,
            autoRecorded: false,
            recording: [],
            startRecordingDateTime: -1,
            lastEdited: -1,
            viewCount: 0,
            err: null,
            canInteract: true,
            showSilverModal: false,
            hasShownSilverModal: false,
            videoPosition: 0,
            videoDuration: 1,
            videoBuffering: false,
            videoStarted: false,
        };

        this.audioOutputHelper = AudioOutputHelper.getInstance(NoteInfoList.notes);
        this.singleNotePlayer = new SingleNotePlayer();
        this.noteKeyboardManager = new NoteKeyboardManager(NoteInfoList.notes, 0, this);

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
            this.setState({
                videoDuration: this.video.getDuration(),
            });
            if (!this.state.hasRecorded) {
                this.setState({
                    recordingYoutubeEndTime: this.video.getDuration(),
                });
            } else {
                this.setState({
                    videoPosition: this.state.recordingYoutubeStartTime,
                });
            }
        }, 5);

    }

    private onStateChange(event) {
        if (event.data == 5) {
            console.log("new video cued");

            this.reset();

            this.setState({ stateName: RecorderStateName.Loading });
            this.video.playVideo();
        }

        if (event.data == 1) { // playing
            if (this.state.stateName === RecorderStateName.Loading) {
                this.setState({
                    videoDuration: this.video.getDuration(),
                    videoPosition: 0,
                    recordingYoutubeStartTime: 0,
                    recordingYoutubeEndTime: this.video.getDuration(),
                    hasRecorded: false,
                });
                this.video.pauseVideo();
            } else {
                this.setState({
                    videoBuffering: false,
                    videoStarted: true,
                });
                this.audioOutputHelper.then(helper => {
                    this.audioOutputStopper = helper.playListOfNotes(this.state.videoPosition * 1000, this.state.recording);
                });
                this.stopPlayingTimeout = setTimeout(() => {
                    this.stopPlayingTimeout = null;
                    this.stopPlayback();
                }, (this.state.recordingYoutubeEndTime - this.state.videoPosition) * 1000) as any;
            }
        }

        if (event.data == 2) { //paused
            console.log("paused");
            this.setState({
                stateName: RecorderStateName.FreePlay,
                videoBuffering: false
            });
        }

        if (event.data == 3) { // buffering
            if (this.stopPlayingTimeout) {
                clearTimeout(this.stopPlayingTimeout);
            }

            if (this.audioOutputStopper) {
                this.audioOutputStopper.stop();
                this.audioOutputStopper = null;
            }

            this.setState({videoBuffering: this.state.videoStarted});
        }
    }

    private onPlayNote(note: ICompositionNote) {
        this.noteKeyboardManager.addDownNote(note);

    }

    render() {
        console.log("rendering...");
        console.log(this.state);

        const wrapperStyle = {width: 400, margin: 50};

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
                        RecorderPlayerPageComponent.styles.keyboardContainer
                    ]}>
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

                    <div style={[
                        RecorderPlayerPageComponent.styles.flex,
                        TitleFont
                    ]}>
                        (Hint: the leftmost white note is C)
                    </div>

                    <br/>

                    <div style={[
                        RecorderPlayerPageComponent.styles.flex
                    ]}>
                        <VideoPlayer
                            videoId={this.state.youtubeVideoId}
                            onVideoReady={this.onVideoReady.bind(this)}
                            onStateChange={this.onStateChange.bind(this)}
                            canInteract={this.canVideoPlayerInteract()}
                            hide={true}/>
                    </div>
                    <ControllerBarComponent
                        hasRecorded={this.state.hasRecorded}
                        save={this.save.bind(this)}
                        reset={this.reset.bind(this)}
                        record={this.record.bind(this)}
                        play={this.play.bind(this)}
                        stopPlayback={this.stopPlayback.bind(this)}
                        stopRecording={this.stopRecording.bind(this)}
                        viewOnly={this.props.viewOnly}
                        stateName={this.state.stateName}
                        initialVolume={(typeof this.video === 'undefined' ? 100 : this.video.getVolume())}
                        onVolumeChange={this.handleVolumeChange.bind(this)}
                        youtubeVideoId={this.state.youtubeVideoId}
                        onVideoIdChange={this.handleVideoIdChange.bind(this)}
                        videoDuration={this.state.videoDuration}
                        videoPosition={Math.max(this.state.videoPosition, this.state.recordingYoutubeStartTime)}
                        startTime={this.state.recordingYoutubeStartTime}
                        endTime={this.state.recordingYoutubeEndTime}
                        onTimeSliderChange={this.handleOnTimeChange.bind(this)}
                        videoBuffering={this.state.videoBuffering}/>
                    <div>
                        <ReactModal
                            isOpen={this.state.showSilverModal}
                            contentLabel="Upcoming Feature"
                            style={RecorderPlayerPageComponent.styles.modal}
                        >
                            <div style={[
                                RecorderPlayerPageComponent.styles.flex
                            ]}>
                                Sorry, this note (D#) is not available in the current version of floot.
                            </div>
                            <div style={[
                                RecorderPlayerPageComponent.styles.flex
                            ]}>
                                Please check back regularly for more updates and new features!
                            </div>
                            <div style={[
                                RecorderPlayerPageComponent.styles.flex
                            ]}>
                                <button onClick={this.handleCloseModal.bind(this)}>Got it!</button>
                            </div>
                        </ReactModal>
                    </div>
                </div>
            </div>
        );
    }

    private handleOnTimeChange(value: number[]) {
        console.log("handling time change");
        console.log(value);

        this.setState({
            recordingYoutubeStartTime: (value[0] + 1) / 1000 * this.state.videoDuration,
            videoPosition: value[1] / 1000 * this.state.videoDuration,
            recordingYoutubeEndTime: (value[2] - 1) / 1000 * this.state.videoDuration
        });

    }

    private handleVolumeChange(volume: number) {
        this.video.setVolume(volume);
    }

    private canVideoPlayerInteract(): boolean {
        return (this.state.stateName == RecorderStateName.FreePlay) && !this.props.viewOnly;
    }

    private handleVideoIdChange(id: string): void {
        if (this.state.stateName === RecorderStateName.FreePlay) {
            this.setState({
                youtubeVideoId: id,
                videoStarted: false,
            }, () => {
                this.reset();
            });
        }
    }

    private reset() {
        if (this.state.stateName === RecorderStateName.FreePlay) {
            this.noteKeyboardManager.clearPlayedNotes();
            this.setState({
                recordingYoutubeStartTime: 0,
                recordingYoutubeEndTime: this.video.getDuration(),
                stateName: RecorderStateName.FreePlay,
                hasRecorded: false,
                recording: [],
                startRecordingDateTime: 0
            });
        }
    }

    private record() {
        if (this.state.stateName === RecorderStateName.FreePlay) {
            this.noteKeyboardManager.clearPlayedNotes();
            this.setState({
                recording: [],
                stateName: RecorderStateName.Recording,
                startRecordingDateTime: new Date().getTime(),
                videoPosition: this.state.recordingYoutubeStartTime
            });
            this.video.seekTo(this.state.recordingYoutubeStartTime);
            this.video.playVideo();
        }
    }

    private stopRecording() {
        if (this.state.stateName === RecorderStateName.Recording) {
            let endTime = this.state.videoPosition;
            this.setState({
                stateName: RecorderStateName.FreePlay,
                hasRecorded: true,
                recording: this.state.recording.concat(this.state.noteState.played.slice()),
                lastEdited: Date.now(),
                videoPosition: this.state.recordingYoutubeStartTime,
                recordingYoutubeEndTime: endTime,
                videoBuffering: false,
            }, () => this.save());
            this.video.pauseVideo();
            this.video.seekTo(this.state.recordingYoutubeStartTime);

            if (this.stopPlayingTimeout) {
                clearTimeout(this.stopPlayingTimeout);
            }

            if (this.audioOutputStopper) {
                this.audioOutputStopper.stop();
                this.audioOutputStopper = null;
            }
        }
    }

    private play() {
        if (this.state.stateName === RecorderStateName.FreePlay) {
            this.setState({
                stateName: RecorderStateName.Playing
            });

            this.video.seekTo(this.state.videoPosition);
            this.video.playVideo();
        }
    }

    private stopPlayback() {
        if (this.state.stateName === RecorderStateName.Playing) {
            this.setState({
                stateName: RecorderStateName.FreePlay,
                videoBuffering: false,
            });
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

    handleOpenModal() {
        console.log("handling open modal");
        if (!this.state.hasShownSilverModal) {
            this.setState({
                showSilverModal: true,
                hasShownSilverModal: true
            });
        }

    }

    handleCloseModal() {
        console.log("handling close modal");
        this.setState({showSilverModal: false});
    }

    private static readonly buttonColor = "rgb(192, 192, 192)";
    private static styles = {
        base: {
            width: "100vw",
            height: `calc(100vh - ${ControllerBarComponent.HEIGHT})`
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
            padding: "10px"
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
        },
        modal: {
            overlay: {
                position: 'fixed',
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            content: {
                position: "relative",
                border: '1px solid #ccc',
                background: '#fff',
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
                borderRadius: '0px',
                outline: 'none',
                padding: '20px',
                width: "400px",
                height: "200px",
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
    autoRecorded: boolean;
    lastEdited: number;
    viewCount: number;
    recording: ICompositionNote[];
    err: Error;
    canInteract: boolean;
    showSilverModal: boolean;
    hasShownSilverModal: boolean;
    videoPosition: number;
    videoDuration: number;
    videoBuffering: boolean;
    videoStarted: boolean;
}

export enum RecorderStateName {
    FreePlay = "free_play",
    Recording = "recording",
    Playing = "playing",
    Saving = "saving",
    Loading = "loading",
}