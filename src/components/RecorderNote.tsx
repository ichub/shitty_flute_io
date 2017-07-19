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
                RecorderNote.styles.downState(this.props.isDown),
            ]}>
                note: {this.props.note.name}
            </div>
        );
    }

    private static styles = {
        base: {
            width: "100%",
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