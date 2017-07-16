import * as React from "react";
import * as Radium from "radium";
import * as color from "color";

import {INoteInfo} from "../models/INoteInfo";

declare const initializedState: any;

@Radium
export class Composer extends React.Component<IComposerProps, IComposerState> {
    props: IComposerProps;
    state: IComposerState;

    constructor(props: IComposerProps) {
        super(props);

        this.state = {
            downNotes: [],
        };
    }

    componentDidMount() {
        this.attachListeners();
    }

    attachListeners() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            console.log(e);

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
            if (this.state.downNotes[i].name == note.name) {
                return true;
            }
        }

        return false;
    }

    handleNoteDown(note: INoteInfo) {
        if (!this.isNoteDown(note)) {
            const copied = this.state.downNotes.slice();
            copied.push(note);
            this.setState({downNotes: copied});
        }
    }

    handleNoteUp(note: INoteInfo) {
        if (this.isNoteDown(note)) {
            const copied = this.state.downNotes.filter(item => item.name !== note.name);
            this.setState({downNotes: copied});
        }
    }

    render() {
        return (
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

                </div>
            </div>
        );
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
            backgroundColor: color("purple").lighten(0.5).hex(),
            overflow: "hidden",
        },
    };
}

export interface IComposerProps {
    notes: INoteInfo[];
}

export interface IComposerState {
    downNotes: INoteInfo[];
}