import * as React from "react";
import * as Radium from "radium";
import * as color from "color";
import {IFluteButtonInfo} from "../models/IFluteButtonInfo";

@Radium
export class FluteButton extends React.Component<IFluteButtonProps, IFluteButtonState> {
    props: IFluteButtonProps;
    state: IFluteButtonState;

    constructor(props: IFluteButtonProps) {
        super();
    }

    render() {
        return (
            <div style={[
                FluteButton.styles.base,
            ]}>
                <span style={[
                    FluteButton.styles.noteText,
                ]}>
                    {this.props.buttonInfo.name}
                </span>
            </div>
        );
    }

    private static buttonColor = "red";
    private static styles = {
        base: {
            width: "100px",
            height: "100px",
            backgroundColor: FluteButton.buttonColor,
            margin: "20px",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            "-webkit-user-select": "none",

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
    buttonInfo: IFluteButtonInfo;
}

export interface IFluteButtonState {

}