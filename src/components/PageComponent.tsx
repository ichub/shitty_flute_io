import * as React from "react";
import {IFluteButtonInfo, makeIFluteButtonInfo} from "../models/IFluteButtonInfo";
import {FluteButton} from "./FluteButton";
import * as Radium from "radium";

@Radium
export class PageComponent extends React.Component<any, IPageComponentState> {
    public state: IPageComponentState;

    constructor(props) {
        super();

        this.state = {
            buttons: [
                makeIFluteButtonInfo("A", "/res/notes/A-Normal.mp3", "/res/notes/A-Shitty.mp3"),
                makeIFluteButtonInfo("B", "/res/notes/B-Normal.mp3", "/res/notes/B-Shitty.mp3"),
                makeIFluteButtonInfo("C", "/res/notes/C-Normal.mp3", "/res/notes/C-Shitty.mp3"),
                makeIFluteButtonInfo("D", "/res/notes/D-Normal.mp3", "/res/notes/D-Shitty.mp3"),
                makeIFluteButtonInfo("E", "/res/notes/E-Normal.mp3", "/res/notes/E-Shitty.mp3"),
                makeIFluteButtonInfo("F", "/res/notes/F-Normal.mp3", "/res/notes/F-Shitty.mp3"),
                makeIFluteButtonInfo("G", "/res/notes/G-Normal.mp3", "/res/notes/G-Shitty.mp3"),
            ],
        };
    }

    public render() {
        return (
            <div>
                <div style={[
                    PageComponent.styles.base,
                ]}>
                    {
                        this.state.buttons.map(button => {
                            return <FluteButton key={button.name} buttonInfo={button}/>;
                        })
                    }
                </div>
            </div>
        );
    }

    private static styles = {
        base: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100vw",
            height: "100vh",
        },
    };
}

export interface IPageComponentState {
    buttons: IFluteButtonInfo[];
}