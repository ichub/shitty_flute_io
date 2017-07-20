import * as React from "react";
import * as Radium from "radium";
import {INoteInfo} from "../models/INoteInfo";
import {GlobalFont} from "../styles/GlobalStyles";
import {NoteType} from "../models/NoteInfoList";

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
                RecorderNote.styles.downState(this.props.isDown, this.props.note.type),
                RecorderNote.styles.flatState(this.props.note.type),
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
            fontSize: "1em",
            borderRadius: "10px",
            border: "1px solid black"
        },
        downState: (isDown: boolean, type: NoteType) => {
            if (type == NoteType.Dummy) {
                return {
                    backgroundColor: "grey",
                };
            }
            if (isDown) {
                return {
                    backgroundColor: "red",
                };
            }

            return {};
        },
        flatState: (type: NoteType) => {
            if (type == NoteType.Flat) {
                return {
                    color: "white",
                    backgroundColor: "black",
                };
            }
            if (type == NoteType.Dummy) {
                return {
                    color: "rgb(225, 225, 225)",
                    backgroundColor: "rgb(225, 225, 225)"
                };
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