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
import {MaterialGray, MaterialYellow, ModalStyle, NiceButton, SmallButton, TitleFont} from "../../styles/GlobalStyles";
import * as color from "color";
import {ShareComponent} from "../ShareComponent";
import {getINoteInfoForPositionIndex, NoteUIPositionList} from "../../models/NoteUIPositionList";
import * as ReactModal from "react-modal";
import {ControllerBarComponent} from "../ControllerBarComponent";
import {UnavailableNoteModal} from "../UnavailableNoteModal";
import {YoutubeApi} from "../../server/YoutubeApi";
import {BufferingComponent} from "../BufferingComponent";

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
    audioOutputStopper: { stop: () => void };

    boundOnHomeClick;
    boundOnFlootifyClick;
    boundOnVideoReady;
    boundOnStateChange;
    boundSave;
    boundReset;
    boundRecord;
    boundPlay;
    boundStopPlayback;
    boundStopRecording;
    boundHandleVolumeChange;
    boundHandleVideoIdChange;
    boundHandleOnTimeChange;
    boundHandleCloseModal;
    boundHandleOpenShareModal;
    boundHandleCloseShareModal;

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
            youtubeVideoId: "",
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
            initialized: false,
            showShareModal: false,
            playbackDownNotes: []
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

        this.audioOutputHelper.then(helper => {
            helper.on(AudioOutputHelper.ON_NOTE_START, (noteId) => {
                this.state.playbackDownNotes.push(noteId);
                this.setState({
                    playbackDownNotes: this.state.playbackDownNotes
                });
            });

            helper.on(AudioOutputHelper.ON_NOTE_END, (noteId) => {
                this.state.playbackDownNotes.splice(this.state.playbackDownNotes.indexOf(noteId));
                this.setState({
                    playbackDownNotes: this.state.playbackDownNotes
                });
            });
        });

        this.initializeHandlers();
    }

    componentDidMount() {
        this.loadData();
    }

    initializeHandlers() {
        this.boundOnHomeClick = this.onHomeClick.bind(this);
        this.boundOnFlootifyClick = this.onFlootifyClick.bind(this);
        this.boundOnVideoReady = this.onVideoReady.bind(this);
        this.boundOnStateChange = this.onStateChange.bind(this);
        this.boundSave = this.save.bind(this);
        this.boundReset = this.reset.bind(this);
        this.boundRecord = this.record.bind(this);
        this.boundPlay = this.play.bind(this);
        this.boundStopPlayback = this.stopPlayback.bind(this);
        this.boundStopRecording = this.stopRecording.bind(this);
        this.boundHandleVolumeChange = this.handleVolumeChange.bind(this);
        this.boundHandleVideoIdChange = this.handleVideoIdChange.bind(this);
        this.boundHandleOnTimeChange = this.handleOnTimeChange.bind(this);
        this.boundHandleCloseModal = this.handleCloseModal.bind(this);
        this.boundHandleOpenShareModal = this.handleOpenShareModal.bind(this);
        this.boundHandleCloseShareModal = this.handleCloseShareModal.bind(this);
    }

    private isNoteDown(note: INoteInfo): boolean {
        if (!note) {
            return false;
        }
        const isUserDown = this.state.noteState.down.filter(down => down.note.name === note.name).length === 1;
        const isPlaybackDown = this.state.playbackDownNotes.filter(down => down === note.noteId).length === 1;

        return isUserDown || isPlaybackDown;
    }

    private onVideoReady(event) {
        this.video = event.target as IYoutubeVideoPlayer;
    }

    private onStateChange(event) {
        if (event.data == 5) {
            YoutubeApi.getDurationOnVideo(this.state.youtubeVideoId)
                .then((duration) => {
                    this.setState({
                        videoDuration: duration,
                    }, () => {
                        if (this.state.initialized) {
                            this.reset();
                        } else {
                            this.setState({
                                initialized: true,
                            })
                        }
                    })
                });
        }

        if (event.data == 1) { // playing
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

        if (event.data == 2) { //paused
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

    private onHomeClick() {
        window.location.href = "/";
    }

    private onFlootifyClick() {
        window.location.href = "/auto-compose";
    }

    render() {
        return (
            <div style={[
                RecorderPlayerPageComponent.styles.base,
                RecorderPlayerPageComponent.styles.flex
            ]}>
                <BufferingComponent isBuffering={this.state.videoBuffering}/>
                <input
                    style={[
                        TitleFont,
                        RecorderPlayerPageComponent.styles.homeButton,
                    ]}
                    type="button"
                    value="floot"
                    key="home-button"
                    onClick={this.boundOnHomeClick}/>

                <div style={{width: "100%"}}>
                    <div style={[RecorderPlayerPageComponent.styles.flex]}>
                        <ShareComponent viewToken={this.props.viewToken}/>
                    </div>

                    <ReactModal
                        isOpen={this.state.showShareModal}
                        style={ModalStyle}
                        contentLabel="share"
                        onRequestClose={this.boundHandleCloseShareModal}>
                        <ShareComponent viewToken={this.props.viewToken}/>
                    </ReactModal>

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

                    <div style={[RecorderPlayerPageComponent.styles.flex]}>
                        {
                            this.state.stateName === RecorderStateName.Playing ?
                                <input
                                    style={[
                                        TitleFont,
                                        NiceButton,
                                        MaterialYellow
                                    ]}
                                    type="button"
                                    value="STOP"
                                    key="stopButton"
                                    onClick={this.boundStopPlayback}/> :
                                <input
                                    style={[
                                        TitleFont,
                                        NiceButton,
                                        this.state.stateName !== RecorderStateName.FreePlay ? MaterialGray : {}
                                    ]}
                                    type="button"
                                    value={this.state.stateName === RecorderStateName.FreePlay ? "PLAY" : "    "}
                                    key="play-button"
                                    onClick={this.boundPlay}/>
                        }
                    </div>

                    <div style={[RecorderPlayerPageComponent.styles.flex]}>
                        <input
                            style={[
                                TitleFont,
                                NiceButton,
                                SmallButton
                            ]}
                            type="button"
                            value="FLOOTIFY FOR ME"
                            key="flootify-button"
                            onClick={this.boundOnFlootifyClick}/>
                    </div>


                    <VideoPlayer
                        videoId={this.state.youtubeVideoId}
                        onVideoReady={this.boundOnVideoReady}
                        onStateChange={this.boundOnStateChange}
                        canInteract={this.canVideoPlayerInteract()}
                        hide={true}/>

                    <ControllerBarComponent
                        hasRecorded={this.state.hasRecorded}
                        save={this.boundSave}
                        reset={this.boundReset}
                        record={this.boundRecord}
                        play={this.boundPlay}
                        stopPlayback={this.boundStopPlayback}
                        stopRecording={this.boundStopRecording}
                        viewOnly={this.props.viewOnly}
                        stateName={this.state.stateName}
                        initialVolume={(typeof this.video === 'undefined' ? 100 : this.video.getVolume())}
                        onVolumeChange={this.boundHandleVolumeChange}
                        youtubeVideoId={this.state.youtubeVideoId}
                        onVideoIdChange={this.boundHandleVideoIdChange}
                        videoDuration={this.state.videoDuration}
                        videoPosition={Math.max(this.state.videoPosition, this.state.recordingYoutubeStartTime)}
                        startTime={this.state.recordingYoutubeStartTime}
                        endTime={this.state.recordingYoutubeEndTime}
                        onTimeSliderChange={this.boundHandleOnTimeChange}
                        videoBuffering={this.state.videoBuffering}/>
                    <ReactModal
                        isOpen={this.state.showSilverModal}
                        style={ModalStyle}
                        contentLabel="unavailable"
                        onRequestClose={this.boundHandleCloseModal}>
                        <UnavailableNoteModal onDone={this.boundHandleCloseModal}/>
                    </ReactModal>
                </div>
            </div>
        );
    }

    private handleOnTimeChange(value: number[]) {
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
            if (id !== "") {
                this.setState({
                    youtubeVideoId: id,
                    videoStarted: false,
                }, () => {
                    this.reset();
                });
            }
        }
    }

    private reset() {
        if (this.state.stateName === RecorderStateName.FreePlay) {
            this.noteKeyboardManager.clearPlayedNotes();
            let duration = this.state.videoDuration;
            this.setState({
                recordingYoutubeStartTime: 0,
                recordingYoutubeEndTime: duration,
                stateName: RecorderStateName.FreePlay,
                hasRecorded: false,
                recording: [],
                startRecordingDateTime: 0,
                videoPosition: 0,
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
        return Promise.resolve();
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
                let compositionState = result.data as ICompositionState;
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
            recordingYoutubeEndTime: (compositionState.hasRecorded ? compositionState.recordingYoutubeEndTime : compositionState.videoDuration),
            startRecordingDateTime: compositionState.startRecordingDateTime,
            hasRecorded: compositionState.hasRecorded,
            autoRecorded: compositionState.autoRecorded,
            lastEdited: compositionState.lastEdited,
            viewCount: compositionState.viewCount,
            recording: compositionState.notes,
            videoDuration: compositionState.videoDuration,
            videoPosition: compositionState.recordingYoutubeStartTime,
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
            videoDuration: this.state.videoDuration,
            notes: this.state.recording
        };

        return compositionState as ICompositionState;
    }

    handleOpenModal() {
        if (!this.state.hasShownSilverModal) {
            this.setState({
                showSilverModal: true,
                hasShownSilverModal: true
            });
        }
    }

    handleCloseModal() {
        this.setState({showSilverModal: false});
    }

    handleOpenShareModal() {
        this.setState({showShareModal: true});

    }

    handleCloseShareModal() {
        this.setState({showShareModal: false});
    }

    private static readonly buttonColor = "rgb(192, 192, 192)";
    private static styles = {
        base: {
            width: "100vw",
            height: `calc(100vh - ${ControllerBarComponent.HEIGHT})`
        },
        share: {
            opacity: 0.5,
            transition: "200ms",
            cursor: "pointer",
            fontSize: "2em",
            marginBottom: "20px",
            userSelect: "none",
            ":hover": {
                opacity: 1,
                fontWeight: "bold",
            }
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
        homeButton: {
            padding: "10px 5px 10px 5px",
            backgroundColor: "white",
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "black",
            border: "none",
            cursor: "pointer",
            transition: "200ms",
            fontSize: "3em",
            opacity: 0.4,
            ":hover": {
                opacity: 1,
                transform: "scale(1.1)"
            }
        },
        flootifyButton: {
            position: "initial",
            textAlign: "center",
            top: "initial",
            left: "initial",
            margin: "0 auto",
            fontSize: "2em",
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
    initialized: boolean;
    showShareModal: boolean;
    playbackDownNotes: number[];
}

export enum RecorderStateName {
    FreePlay = "free_play",
    Recording = "recording",
    Playing = "playing",
    Saving = "saving",
    Loading = "loading",
}