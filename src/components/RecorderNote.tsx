import * as React from "react";
import * as Radium from "radium";
import {INoteInfo} from "../models/INoteInfo";
import {GlobalFont} from "../styles/GlobalStyles";
import {INoteUIPosition} from "../models/INoteUIPosition";

@Radium
export class RecorderNote extends React.Component<IRecorderNoteProps, IRecorderNoteState> {
    props: IRecorderNoteProps;
    state: IRecorderNoteState;

    constructor(props: IRecorderNoteProps) {
        super();
    }

    render() {
        return (
            <div style={[
                GlobalFont,
                RecorderNote.styles.base,
                RecorderNote.styles.flatState(this.props.notePosition.isMinor),
                RecorderNote.styles.downState(this.props.isDown),
                RecorderNote.styles.dummyState(this.props.isDummy)
            ]}>
                {this.props.notePosition.keyboardCharacter}
            </div>
        );
    }

    private static readonly WIDTH = 40;
    private static readonly HEIGHT = 100;

    private static styles = {
        base: {
            width: `${RecorderNote.WIDTH}px`,
            height: `${RecorderNote.HEIGHT}px`,
            fontWeight: "bold",
            backgroundColor: "white",
            color: "black",
            marginLeft: "10px",
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1em",
            borderRadius: "4px",
            border: "1px solid black"
        },
        downState: (isDown: boolean) => {
            if (isDown) {
                return {
                    backgroundColor: "red"
                };
            }

            return {};
        },
        flatState: (isMinor: boolean) => {
            if (isMinor) {
                return {
                    color: "white",
                    backgroundColor: "black"
                };
            }

            return {};
        },
        dummyState: (isDummy: boolean) => {
            if (isDummy) {
                return {
                    border: "1px solid rgb(225, 225, 225)",
                    color: "rgb(225, 225, 225)",
                    backgroundColor: "rgb(225, 225, 225)"
                };
            }

            return {};
        }
    };
}

export interface IRecorderNoteProps {
    notePosition: INoteUIPosition;
    note: INoteInfo;
    isDown: boolean;
    isDummy: boolean;
}

export interface IRecorderNoteState {

}