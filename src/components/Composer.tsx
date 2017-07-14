import * as React from "react";
import * as Radium from "radium";
import {INoteInfo} from "../models/INoteInfo";

@Radium
export class Composer extends React.Component<IComposerProps, IComposerState> {
    private static readonly DURATION = 10;

    props: IComposerProps;
    state: IComposerState;

    constructor(props: IComposerProps) {
        super(props);

        this.state = {
            composition: this.makeNewComposition(),
        };
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
    composition: boolean[][];
}