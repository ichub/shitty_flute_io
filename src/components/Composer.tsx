import * as React from "react";
import * as Radium from "radium";
import {INoteInfo} from "../models/INoteInfo";

@Radium
export class Composer extends React.Component<IComposerProps, IComposerState> {
    private static readonly DURATION = 10;
    private static readonly MILLISECONDS_PER_NOTE = 500;

    props: IComposerProps;
    state: IComposerState;

    constructor(props: IComposerProps) {
        super(props);

        this.state = {
            playing: false,
            playingColumnIndex: 0,
            composition: this.makeNewComposition(),
        };
    }

    play() {
        this.setState({
            playing: true,
            playingColumnIndex: 0,
        }, () => {
            const playColumnAndNext = () => {
                setTimeout(() => {
                        console.log(`playing column ${this.state.playingColumnIndex}`);

                        for (let note = 0; note < this.props.notes.length; note++) {
                            if (this.isNoteOn(this.state.playingColumnIndex, note)) {
                                console.log(this.props.notes[note]);
                            }
                        }

                        if (this.state.playingColumnIndex < Composer.DURATION - 1) {
                            this.setState({
                                playingColumnIndex: this.state.playingColumnIndex + 1,
                            }, () => {
                                playColumnAndNext();
                            });

                        } else {
                            this.setState({
                                playing: false,
                            }, () => {
                                console.log("finished playing");
                            });
                        }
                    },
                    Composer.MILLISECONDS_PER_NOTE);
            };

            playColumnAndNext();
        });
    }

    makeNewComposition(): boolean[][] {
        const result = [];

        for (let i = 0; i < Composer.DURATION; i++) {
            const column = [];
            result.push(column);

            for (let i = 0; i < this.props.notes.length; i++) {
                column.push(false);
            }
        }

        return result;
    }

    toggleNote(time: number, noteIndex: number): void {
        this.state.composition[time][noteIndex] = !this.state.composition[time][noteIndex];

        this.setState({
            composition: this.state.composition,
        });
    }

    isNoteOn(time: number, noteIndex: number): boolean {
        return this.state.composition[time][noteIndex];
    }

    handleClick(time: number, noteIndex: number) {
        this.toggleNote(time, noteIndex);
    }

    render() {
        return (
            <div style={[
                Composer.styles.base,
            ]}>
                {
                    this.props.notes.map((note, noteIndex) => {
                        const noteButtons = [];

                        for (let time = 0; time < Composer.DURATION; time++) {
                            noteButtons.push((
                                <div onClick={this.handleClick.bind(this, time, noteIndex)}
                                     key={time}
                                     style={[
                                         Composer.styles.inline,
                                         Composer.styles.singleButton,
                                         Composer.styles[this.isNoteOn(time, noteIndex) ? "on" : "off"],
                                     ]}>
                                    button
                                </div>
                            ));
                        }

                        return (
                            <div key={note.name} style={Composer.styles.row}>
                                <div style={[Composer.styles.inline, Composer.styles.rowTitle]}>
                                    {note.name}
                                </div>
                                <div style={Composer.styles.inline}>
                                    {noteButtons}
                                </div>
                            </div>
                        );
                    })
                }
                <input type="button" value="play" onClick={this.play.bind(this)} disabled={this.state.playing}/>
            </div>
        );
    }

    private static styles = {
        base: {
            width: "100%",
            WebkitUserSelect: "none",
        },
        row: {
            width: "100%",
            marginBottom: "10px",
        },
        inline: {
            display: "inline-block",
        },
        rowTitle: {
            width: "20px",
        },
        singleButton: {
            width: "50px",
            height: "50px",
            marginRight: "10px",
            cursor: "pointer",
        },
        on: {
            backgroundColor: "green",
        },
        off: {
            backgroundColor: "grey",
        },
    };
}

export interface IComposerProps {
    notes: INoteInfo[];
}

export interface IComposerState {
    playing: boolean;
    playingColumnIndex: number;
    composition: boolean[][];
}