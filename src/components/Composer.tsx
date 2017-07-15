import * as React from "react";
import * as Radium from "radium";
import * as color from "color";

import {INoteInfo} from "../models/INoteInfo";
import {FluteAudioPlayer} from "./FluteAudioPlayer";
import {IComposition, makeNewIComposition} from "../models/IComposition";

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
            composition: makeNewIComposition(props.notes),
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

    // makeNewComposition(): boolean[][] {
    //     const result = [];
    //
    //     for (let i = 0; i < Composer.DURATION; i++) {
    //         const column = [];
    //         result.push(column);
    //
    //         for (let i = 0; i < this.props.notes.length; i++) {
    //             column.push(false);
    //         }
    //     }
    //
    //     return result;
    // }

    toggleNote(time: number, noteIndex: number): void {
        // this.state.composition[time][noteIndex] = !this.state.composition[time][noteIndex];
        let compositionNote = this.state.composition.compositionNotes[noteIndex]
        if (compositionNote.length <= time) {
            // extend musicDataArray if needed
            let lengthDiff = time - compositionNote.length + 1;
            for (let i = 0; i < lengthDiff - 1; i++) {
                compositionNote.musicData.push(0);
            }
            compositionNote.musicData.push(1);
            compositionNote.length = compositionNote.musicData.length;
        } else {
            if (compositionNote.musicData[time] > 0) {
                compositionNote.musicData[time] = 0;
            } else {
                compositionNote.musicData[time] = 1;
            }
        }
        console.log(compositionNote.musicData)
        this.setState({
            composition: this.state.composition,
        });
    }

    isNoteOn(time: number, noteIndex: number): boolean {
        let compositionNote = this.state.composition.compositionNotes[noteIndex]
        if (compositionNote.length <= time) {
            return false
        }
        return (compositionNote.musicData[time] > 0); // 1 and 2 indicate on
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
                <input type="button" value="save" onClick={this.save.bind(this)} disabled={this.state.playing}/>
            </div>
        );
    }

    private save() {
        // do post here
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
    composition: IComposition;
    currentlyPlayingNotes: number[];
}