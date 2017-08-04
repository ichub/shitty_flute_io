import * as React from "react";
import * as Radium from "radium";
import * as color from "color";
import {INoteInfo} from "../models/INoteInfo";

@Radium
export class FluteButton extends React.Component<IFluteButtonProps, IFluteButtonState> {
    props: IFluteButtonProps;
    state: IFluteButtonState;
    refs: {
        audio: HTMLAudioElement
    };

    constructor(props: IFluteButtonProps) {
        super();
    }

    render() {
        return (
            <div onMouseDown={this.onMouseDown.bind(this)}
                 onMouseUp={this.onMouseUp.bind(this)}
                 style={[
                     FluteButton.styles.base,
                 ]}>
                <span style={[
                    FluteButton.styles.noteText,
                ]}>
                    {this.props.buttonInfo.label}

                    <audio ref="audio" loop={true}>
                          <source src={this.props.buttonInfo.shittySoundFileUrl}/>
                    </audio>
                </span>
            </div>
        );
    }

    onMouseDown() {
        this.refs.audio.play();
    }

    onMouseUp() {
        this.refs.audio.pause();
    }

    private static buttonColor = "red";
    private static styles = {
        base: {
            width: "50px",
            height: "50px",
            backgroundColor: FluteButton.buttonColor,
            margin: "10px",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            WebkitUserSelect: "none",

            ":hover": {
                backgroundColor: color(FluteButton.buttonColor).darken(0.5),
            },
        },
        noteText: {
            fontSize: "3em",
        },
    };
}

export interface IFluteButtonProps {
    buttonInfo: INoteInfo;
}

export interface IFluteButtonState {

}