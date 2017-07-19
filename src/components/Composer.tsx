import * as React from "react";
import * as Radium from "radium";
import * as color from "color";
import {INoteInfo} from "../models/INoteInfo";
import {ICompositionNote} from "../models/ICompositionNote";
import {MusicPlayerHelper} from "../MusicPlayerHelper";
import {AudioOutputHelper} from "../AudioOutputHelper";
import {GlobalFont} from "../styles/GlobalStyles";
import {ICompositionState, makeNewICompositionState} from "../models/ICompositionState";
const axios = require("axios");

@Radium
export class Composer extends React.Component<IComposerProps, IComposerState> {
    private static readonly COMPOSITION_SECONDS = 10;

    props: IComposerProps;
    state: IComposerState;

    refs: {
        milliseconds: HTMLDivElement;
        scrubBar: HTMLDivElement;
    };

    private helper: Promise<AudioOutputHelper>;
    private soundCancellationMap = {};

    constructor(props: IComposerProps) {
        super();
        this.props = props;

        this.state = {
            stateName: ComposerStateName.Idle,
            downNotes: [],
            compositionState: makeNewICompositionState(),
            recordStartingTime: -1,
            recordVideoStartingTime: -1,
            interval: null,
            player: null,
            playingNotes: [],
            videoTitle: "",
        };

        this.helper = AudioOutputHelper.getInstance(props.notes);

        this.reloadData();

        this.helper.then(() => {
            props.onReady();
        });
    }

    convertMillisecondsToPercentage(milliseconds: number): number {
        const totalMilliseconds = Composer.COMPOSITION_SECONDS * 1000;
        return milliseconds / totalMilliseconds * 100;
    }

    hasRecorded(): boolean {
        return this.state.recordVideoStartingTime != -1;
    }

    reloadData() {
        axios.get(`/composer/${this.props.editToken}/data`)
            .then((response) => {
                this.setState({
                    compositionState: response.data.state,
                }, () => {
                    axios.get(`/video-title/${this.state.compositionState.youtubeId}`)
                        .then((response) => {
                            this.setState({
                                videoTitle: response.data.title,
                            });

                            this.props.setVideoTitle(response.data.title);
                        });

                });
            });

    }

    componentDidMount() {
        this.attachKeyboardEventListeners();
    }

    attachKeyboardEventListeners() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            for (let i = 0; i < this.props.notes.length; i++) {
                if (this.isKeyboardEventForNote(this.props.notes[i], e)) {
                    if (!this.soundCancellationMap[this.props.notes[i].name]) {
                        this.soundCancellationMap[this.props.notes[i].name] = this.helper.then(helper => Promise.resolve(helper.playNote(this.props.notes[i], true, -1)));
                    }

                    if (this.state.stateName == ComposerStateName.Recording) {
                        this.handleNoteDown(this.props.notes[i]);
                    }
                }
            }
        });

        document.addEventListener("keyup", (e: KeyboardEvent) => {
            for (let i = 0; i < this.props.notes.length; i++) {
                if (this.isKeyboardEventForNote(this.props.notes[i], e)) {
                    this.soundCancellationMap[this.props.notes[i].name].then((c) => {
                        c.stop();
                        this.soundCancellationMap[this.props.notes[i].name] = null;
                    });

                    if (this.state.stateName == ComposerStateName.Recording) {
                        this.handleNoteUp(this.props.notes[i]);
                    }
                }
            }
        });
    }

    isKeyboardEventForNote(note: INoteInfo, e: KeyboardEvent) {
        return note.keyboardCharacter.toLowerCase() === e.key.toLowerCase();
    }

    isNoteDown(note: INoteInfo): boolean {
        for (let i = 0; i < this.state.downNotes.length; i++) {
            if (this.state.downNotes[i].noteInfo.name == note.name) {
                return true;
            }
        }

        return false;
    }

    handleNoteDown(note: INoteInfo) {
        if (!this.isNoteDown(note)) {

            const copied = this.state.downNotes.slice();
            let time = new Date().getTime();

            const isFirstNote = this.state.recordStartingTime == -1;

            if (isFirstNote) {
                this.startRecordTimer();
            }

            copied.push({
                noteInfo: note,
                start: isFirstNote ? 0 : time - this.state.recordStartingTime,
                length: -1,
            });

            this.setState({
                downNotes: copied,
                recordStartingTime: this.state.recordStartingTime == -1 ? time : this.state.recordStartingTime,
                recordVideoStartingTime: this.state.recordStartingTime == -1 ? this.props.getVideoTime() : this.state.recordStartingTime,
            });
        }
    }

    handleNoteUp(note: INoteInfo) {
        if (this.isNoteDown(note)) {
            const released = this.state.downNotes.filter(item => item.noteInfo.name === note.name)[0];
            released.length = new Date().getTime() - released.start;

            this.state.downNotes = this.state.downNotes.filter(item => item.noteInfo.name != released.noteInfo.name);

            released.length = new Date().getTime() - released.start - this.state.recordStartingTime;
            this.state.compositionState.notes.push(released);

            this.setState({
                downNotes: this.state.downNotes,
                compositionState: this.state.compositionState,
            });
        }
    }

    play(): void {
        if (this.state.stateName === ComposerStateName.Idle) {
            this.setState({
                stateName: ComposerStateName.Playing,
            }, () => {
                this.startScrubTimer();
                this.helper.then(player => player.playComposition(this.state.compositionState));
                this.props.setVideoTime(this.state.recordVideoStartingTime);
                this.props.playVideo();

                setTimeout(() => {
                    this.stopPlaying();
                }, Composer.COMPOSITION_SECONDS * 1000);
            });
        }
    }

    stopPlaying(): void {
        console.log("stop playing");
        if (this.state.stateName === ComposerStateName.Playing) {
            this.props.pauseVideo();

            this.setState({
                stateName: ComposerStateName.Idle,
                playingNotes: [],
            });
        }
    }

    record(): void {
        if (this.state.stateName === ComposerStateName.Idle) {
            this.handleResetClick();
            this.setState({
                stateName: ComposerStateName.Recording,
                recordStartingTime: -1,
            }, () => {
                this.props.setVideoTime(this.state.recordVideoStartingTime);
                this.props.playVideo();
            });
        }
    }

    startRecordTimer(): void {
        this.startScrubTimer();

        this.setState({
            recordStartingTime: new Date().getTime(),
        }, () => {
            const updateTimer = () => {
                const seconds = (new Date().getTime() - this.state.recordStartingTime) / 1000;

                if (seconds >= Composer.COMPOSITION_SECONDS) {
                    this.stopRecording();
                    return;
                }

                this.refs.milliseconds.innerHTML = seconds + "";

            };

            updateTimer();

            if (this.state.interval === null) {
                this.setState({
                    interval: setInterval(updateTimer, 10),
                });
            }
        });
    }

    startScrubTimer(): void {
        const scrubTimeStart = new Date().getTime();

        let interval = setInterval(() => {
                const difference = new Date().getTime() - scrubTimeStart;

                this.refs.scrubBar.style.left =
                    this.convertMillisecondsToPercentage(difference) + "%";

                if (difference >= 10 * 1000) {
                    clearInterval(interval);
                }
            },
            10);
    }

    stopRecording(): void {
        clearInterval(this.state.interval);
        this.state.interval = null;
        this.refs.milliseconds.innerHTML = "";

        for (let note of this.state.downNotes) {
            this.handleNoteUp(note.noteInfo);
        }

        this.props.pauseVideo();

        this.setState({
            stateName: ComposerStateName.Idle,
            downNotes: [],
        });
        console.log(JSON.stringify(this.state.compositionState));
    }

    generateNoteInInterface(note: ICompositionNote): IClickedNoteLayoutParams {
        const scale = 4;

        return {
            nameString: note.noteInfo.name,
            width: this.convertMillisecondsToPercentage(note.length) + "%",
            offset: this.convertMillisecondsToPercentage(note.start) + "%",
        };
    }

    render() {
        window["state"] = this.state.compositionState;
        return (
            <div>
                <div style={[Composer.styles.controls]}>
                    <input
                        type="button"
                        value="play"
                        onClick={this.play.bind(this)}
                        disabled={this.state.stateName !== ComposerStateName.Idle || !this.hasRecorded()}/>
                    <input
                        type="button"
                        value="record"
                        onClick={this.record.bind(this)}
                        disabled={this.state.stateName !== ComposerStateName.Idle}/>
                    <input
                        type="button"
                        value="reset"
                        onClick={this.handleResetClick.bind(this)}
                        disabled={this.state.stateName !== ComposerStateName.Idle}/>

                    <span>
                        {
                            ((state: ComposerStateName) => {
                                switch (state) {
                                    case ComposerStateName.Recording :
                                        return "recording";
                                    case ComposerStateName.Idle :
                                        return "idle";
                                    case ComposerStateName.Playing :
                                        return "playing";
                                }
                            })(this.state.stateName)
                        }
                    </span>
                    <span ref="milliseconds">

                    </span>
                </div>
                <div style={[GlobalFont, Composer.styles.base]}>
                    <div style={[Composer.styles.noteContainer]}>
                        {
                            this.props.notes.map((note, i) => {
                                const downStyle = this.isNoteDown(note) ? Composer.styles.noteDown : null;

                                return (
                                    <div key={i} style={[
                                        Composer.styles.note,
                                        downStyle,
                                    ]}>
                                        {note.name}
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div style={[Composer.styles.timeSeries]}>
                        {
                            this.props.notes.map((note, i) => {
                                const matching = this.state.compositionState.notes.filter(compNote => compNote.noteInfo.name == note.name);
                                return (
                                    <div key={i} style={[Composer.styles.noteRow]}>
                                        {
                                            matching.map(this.generateNoteInInterface.bind(this)).map((int: IClickedNoteLayoutParams, n) => {
                                                return (
                                                    <div key={n} style={[
                                                        Composer.styles.compositionNote,
                                                        {
                                                            width: int.width,
                                                            left: int.offset,
                                                        }]}>
                                                        {int.nameString}
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                );
                            })
                        }
                        <div ref="scrubBar" style={[Composer.styles.scrubBar]}></div>
                    </div>
                </div>

            </div>
        );
    }

    handleResetClick() {
        if (this.state.stateName === ComposerStateName.Idle) {
            this.state.compositionState.notes = [];

            this.setState({
                compositionState: this.state.compositionState,
                stateName: ComposerStateName.Idle,
                downNotes: [],
                recordStartingTime: -1,
            });
        }
    }

    private static styles = {
        base: {
            width: "100vw",
            height: "100vh",
        },
        noteContainer: {
            height: "100%",
            width: "200px",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            WebkitUserSelect: "none",
            backgroundColor: "grey",
            float: "left",
        },
        note: {
            width: "100px",
            height: "100px",
            display: "inline-block",
            backgroundColor: "green",
            margin: "20px",
        },
        noteDown: {
            backgroundColor: "red",
        },
        timeSeries: {
            height: "100%",
            backgroundColor: color("purple").lighten(1).hex(),
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
        },
        controls: {
            width: "100%",
            backgroundColor: color("grey").lighten(20).hex(),
        },
        noteRow: {
            width: "100%",
            position: "relative",
            height: "100px",
            backgroundColor: "white",
            flex: 1,
        },
        compositionNote: {
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            color: "white",
            flex: 1,
            marginTop: "10px",
            marginBottom: "10px",
        },
        scrubBar: {
            position: "absolute",
            width: "2px",
            height: "100%",
            backgroundColor: "blue",
            top: "0px",
        },
    };
}

enum ComposerStateName {
    Idle,
    Recording,
    Playing
}

export interface IClickedNoteLayoutParams {
    width: string;
    nameString: string;
    offset: string;
}

export interface IComposerProps {
    notes: INoteInfo[];
    editToken: string;
    playVideo: () => void;
    pauseVideo: () => void;
    getVideoTime: () => number;
    setVideoTime: (time: number) => void;
    setVideoTitle: (title: string) => void;
    onReady: () => void;
}

export interface IComposerState {
    stateName: ComposerStateName;
    downNotes: ICompositionNote[];
    playingNotes: ICompositionNote[];
    compositionState: ICompositionState;
    recordStartingTime: number;
    recordVideoStartingTime: number;
    interval: NodeJS.Timer;
    player: MusicPlayerHelper;
    videoTitle: string;
}