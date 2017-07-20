import * as React from "react";
import * as Radium from "radium";
import {INoteInfo} from "../models/INoteInfo";

@Radium
export class NoteButtonComponent extends React.Component<INoteButtonComponentProps, INoteButtonComponentState> {
    props: INoteButtonComponentProps;
    state: INoteButtonComponentState;

    constructor(props: INoteButtonComponentProps) {
        super();
    }

    render() {
        return (
            <button style={[
                NoteButtonComponent.styles.base,
            ]}>
                {this.props.button.label}
            </button>
        );
    }

    private static styles = {
        base: {
            width: "100%",
        },
    };

}

export interface INoteButtonComponentProps {
    button: INoteInfo;
}

export interface INoteButtonComponentState {

}