import * as React from "react";
import * as Radium from "radium";
import {INoteInfo, makeINoteInfo} from "../models/INoteInfo";
import {NoteButtonComponent} from "./NoteButtonComponent";

@Radium
export class LandingPageComponent extends React.Component<any, ILandingPageComponentState> {
    public state: ILandingPageComponentState;

    constructor(props) {
        super();

        this.state = {
            notes: [
                makeINoteInfo("C", "/res/notes/C-Normal.mp3", "/res/notes/C-Shitty.mp3", "a"),
                makeINoteInfo("D", "/res/notes/D-Normal.mp3", "/res/notes/D-Shitty.mp3", "s"),
                makeINoteInfo("E", "/res/notes/E-Normal.mp3", "/res/notes/E-Shitty.mp3", "d"),
                makeINoteInfo("F", "/res/notes/F-Normal.mp3", "/res/notes/F-Shitty.mp3", "f"),
                makeINoteInfo("G", "/res/notes/G-Normal.mp3", "/res/notes/G-Shitty.mp3", "g"),
                makeINoteInfo("A", "/res/notes/A-Normal.mp3", "/res/notes/A-Shitty.mp3", "h"),
                makeINoteInfo("B", "/res/notes/B-Normal.mp3", "/res/notes/B-Shitty.mp3", "j")
            ]
        };
    }

    public render() {
        return (
            <div>
                <div style={[
                    LandingPageComponent.styles.base
                ]}>
                    {
                        this.state.notes.map(note => {
                            return <NoteButtonComponent key={note.name} button={note}/>;
                        })
                    }
                </div>
            </div>
        );
    }

    private static styles = {
        base: {}
    };
}

export interface ILandingPageComponentState {
    notes: INoteInfo[];
}