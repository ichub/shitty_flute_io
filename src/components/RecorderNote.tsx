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
            ]}>
                {this.props.note.name}
            </div>
        );
    }

    private static styles = {
        base: {
            width: "50px",
            height: "50px",
            fontWeight: "bold",
            backgroundColor: "black",
            color: "white",
            margin: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        downState: (isDown: boolean) => {
            if (isDown) {
                return {
                    backgroundColor: "red",
                };
            }

            return {};
        },
    };
}

export interface IRecorderNoteProps {
    note: INoteInfo;
    isDown: boolean;
}

export interface IRecorderNoteState {

}