import * as React from "react";
import * as Radium from "radium";
import * as color from "color";
import {INoteInfo} from "../models/INoteInfo";
import {IComposition, makeNewIComposition} from "../models/IComposition";
import {ICompositionNote} from "../models/ICompositionNote";
const axios = require("axios");

@Radium
export class Composer extends React.Component<IComposerProps, IComposerState> {
    props: IComposerProps;
    state: IComposerState;

    constructor(props: IComposerProps) {
        super(props);

        this.state = {
            stateName: ComposerStateName.Idle,
            downNotes: [],
            composition: makeNewIComposition("", this.props.compositionId),
            recordStartingTime: -1,
        };

        this.reloadData();
    }

    reloadData() {
        axios.get(`/composer/${this.props.compositionId}/data`)
            .then((response) => {
                console.log("the loaded composition state is:");
                console.log(response.data);

                this.setState({
                    composition: response.data,
                });
            });
    }

    componentDidMount() {
        this.attachListeners();
    }

    attachListeners() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            for (let i = 0; i < this.props.notes.length; i++) {
                if (this.isKeyboardEventForNote(this.props.notes[i], e)) {
                    this.handleNoteDown(this.props.notes[i]);
                }
            }
        });

        document.addEventListener("keyup", (e: KeyboardEvent) => {
            for (let i = 0; i < this.props.notes.length; i++) {
                if (this.isKeyboardEventForNote(this.props.notes[i], e)) {
                    this.handleNoteUp(this.props.notes[i]);
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

            copied.push({
                noteInfo: note,
                start: isFirstNote ? 0 : time - this.state.recordStartingTime,
                length: -1,
            });

            this.setState({
                downNotes: copied,
                recordStartingTime: this.state.recordStartingTime == -1 ? time : this.state.recordStartingTime,
            });
        }
    }

    handleNoteUp(note: INoteInfo) {
        if (this.isNoteDown(note)) {
            const released = this.state.downNotes.filter(item => item.noteInfo.name === note.name)[0];
            released.length = new Date().getTime() - released.start;

            this.state.downNotes = this.state.downNotes.filter(item => item.noteInfo.name != released.noteInfo.name);

            released.length = new Date().getTime() - released.start - this.state.recordStartingTime;
            this.state.composition.notes.push(released);

            this.setState({
                downNotes: this.state.downNotes,
                composition: this.state.composition,
            });
        }
    }

    handlePlayClick(): void {
        this.setState({
            stateName: ComposerStateName.Playing,
        });
    }

    handleRecordClick(): void {
    }

    generateNoteInInterface(note: ICompositionNote): IClickedNoteLayoutParams {
        const scale = 4;

        return {
            nameString: note.noteInfo.name,
            height: "10px",
            width: note.length * (1 / scale) + "px",
            offset: note.start * (1 / scale),
        };
    }

    render() {
        return (
            <div>
                <div style={[Composer.styles.base]}>
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
                                const matching = this.state.composition.notes.filter(compNote => compNote.noteInfo.name == note.name);
                                let runningOffset = 0;

                                return (
                                    <div key={i} style={[Composer.styles.noteRow]}>
                                        {
                                            matching.map(this.generateNoteInInterface).map((int, n) => {
                                                runningOffset += int.offset;

                                                return (
                                                    <div key={n} style={[
                                                        Composer.styles.compositionNote,
                                                        {
                                                            width: int.width,
                                                            height: int.height,
                                                            left: int.offset + "px",
                                                            backgroundColor: "orange",
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
                    </div>
                </div>
                <div style={[Composer.styles.controls]}>
                    <input type="button" value="play" onClick={this.handlePlayClick.bind(this)}/>
                    <input type="button" value="record" onClick={this.handleRecordClick.bind(this)}/>
                </div>
            </div>
        );
    }

    private static styles = {
        base: {
            width: "100vw",
            height: "50vh",

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
        },
        controls: {
            width: "100%",
            backgroundColor: color("grey").lighten(20).hex(),
        },
        noteRow: {
            width: "100%",
            position: "relative",
            height: "20px",
        },
        compositionNote: {
            position: "absolute",
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
    height: string;
    nameString: string;
    offset: number;
}

export interface IComposerProps {
    notes: INoteInfo[];
    compositionId: string;
}

export interface IComposerState {
    stateName: ComposerStateName;
    downNotes: ICompositionNote[];
    composition: IComposition;
    recordStartingTime: number;
}