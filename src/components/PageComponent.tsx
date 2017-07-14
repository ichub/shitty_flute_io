import * as React from "react";
import * as Radium from "radium";
import {Composer} from "./Composer";
import {INoteInfo, makeINoteInfo} from "../models/INoteInfo";

@Radium
export class PageComponent extends React.Component<any, IPageComponentState> {
    public state: IPageComponentState;

    constructor(props) {
        super();

        this.state = {
            notes: [
                makeINoteInfo("C", "/res/notes/C-Normal.mp3", "/res/notes/C-Shitty.mp3"),
                makeINoteInfo("D", "/res/notes/D-Normal.mp3", "/res/notes/D-Shitty.mp3"),
                makeINoteInfo("E", "/res/notes/E-Normal.mp3", "/res/notes/E-Shitty.mp3"),
                makeINoteInfo("F", "/res/notes/F-Normal.mp3", "/res/notes/F-Shitty.mp3"),
                makeINoteInfo("G", "/res/notes/G-Normal.mp3", "/res/notes/G-Shitty.mp3"),
                makeINoteInfo("A", "/res/notes/A-Normal.mp3", "/res/notes/A-Shitty.mp3"),
                makeINoteInfo("B", "/res/notes/B-Normal.mp3", "/res/notes/B-Shitty.mp3"),
            ],
        };
    }

    public render() {
        return (
            <div>
                <div style={[
                    PageComponent.styles.base,
                ]}>
                    <Composer notes={this.state.notes}/>
                </div>
            </div>
        );
    }

    private static styles = {
        base: {
        },
    };
}

export interface IPageComponentState {
    notes: INoteInfo[];
}