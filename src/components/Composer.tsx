import * as React from "react";
import * as Radium from "radium";
import * as color from "color";

import {INoteInfo} from "../models/INoteInfo";
import {FluteAudioPlayer} from "./FluteAudioPlayer";

@Radium
export class Composer extends React.Component<IComposerProps, IComposerState> {
    private static readonly DURATION = 10;
    private static readonly MILLISECONDS_PER_NOTE = 250;

    props: IComposerProps;
    state: IComposerState;

    constructor(props: IComposerProps) {
        super(props);

        this.state = {
            playing: false,
            playingColumnIndex: -1,
            composition: this.makeNewComposition(),
            currentlyPlayingNotes: [],
        };
    }

    play() {
        this.setState({
            playing: true,
            playingColumnIndex: 0,
        }, () => {
            const playColumnAndNext = () => {
                setTimeout(() => {
                        if (this.state.playingColumnIndex < Composer.DURATION - 1) {
                            this.setState({
                                playingColumnIndex: this.state.playingColumnIndex + 1,
                                currentlyPlayingNotes: this.getCurrentlyPlayingNotes(),
                            }, () => {
                                playColumnAndNext();
                            });

                        } else {
                            this.setState({
                                playing: false,
                                playingColumnIndex: -1,
                            });
                        }
                    },
                    Composer.MILLISECONDS_PER_NOTE);
            };
            playColumnAndNext();
        });
    }

    getCurrentlyPlayingNotes(): number[] {
        if (this.state.playingColumnIndex == -1) {
            return [];
        }

        const result = [];

        for (let note = 0; note < this.props.notes.length; note++) {
            if (this.isNoteOn(this.state.playingColumnIndex, note)) {
                result.push(note);
            }
        }

        return result;
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
        if (!this.state.playing) {
            this.toggleNote(time, noteIndex);
        }
    }

    render() {
        return (
            <div style={[
                Composer.styles.base,
            ]}>
                <FluteAudioPlayer notes={this.props.notes}
                                  playingIndices={this.state.currentlyPlayingNotes}/>

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
                                         Composer.styles[time == this.state.playingColumnIndex ? (this.isNoteOn(time, noteIndex) ? "playingOn" : "playingOff") : "none"],
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
        playingOn: {
            backgroundColor: "yellow",
        },
        playingOff: {
            backgroundColor: color("grey").lighten(0.5).hex(),
        },
        none: {},
    };
}

export interface IComposerProps {
    notes: INoteInfo[];
}

export interface IComposerState {
    playing: boolean;
    playingColumnIndex: number;
    composition: boolean[][];
    currentlyPlayingNotes: number[];
}