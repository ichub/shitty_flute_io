import * as React from "react";
import * as Radium from "radium";
import {INoteInfo} from "../models/INoteInfo";
import {GlobalFont} from "../styles/GlobalStyles";

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
                RecorderNote.styles.downState(this.props.isDown),
                RecorderNote.styles.flatState(this.props.note.isFlat),
            ]}>
                {this.props.note.keyboardCharacter}
            </div>
        );
    }

    private static styles = {
        base: {
            width: "75px",
            height: "75px",
            fontWeight: "bold",
            backgroundColor: "white",
            color: "black",
            margin: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2em",
            borderRadius: "5px"
        },
        downState: (isDown: boolean) => {
            if (isDown) {
                return {
                    backgroundColor: "red",
                };
            }

            return {};
        },
        flatState: (isFlat: boolean) => {
            if (isFlat) {
                return {
                    color: "white",
                    backgroundColor: "black",
                }
            }
            
            return {};
        }
    };
}

export interface IRecorderNoteProps {
    note: INoteInfo;
    isDown: boolean;
}

export interface IRecorderNoteState {

}