import * as React from "react";
import * as Radium from "radium";
import {INoteInfo} from "../models/INoteInfo";

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
                RecorderNote.styles.base,
            ]}>
                note: {this.props.note.name}
            </div>
        );
    }

    private static styles = {
        base: {
            width: "100%",
        },
    };
}

export interface IRecorderNoteProps {
    note: INoteInfo;
}

export interface IRecorderNoteState {

}