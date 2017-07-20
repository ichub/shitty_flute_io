import * as React from "react";
import * as Radium from "radium";

@Radium
export class ShowModeComponent extends React.Component<IShowModeComponentProps, IShowModeComponentState> {
    props: IShowModeComponentProps;
    state: IShowModeComponentState;

    constructor(props: IShowModeComponentProps) {
        super();
    }

    render() {
        const text: string = this.props.viewOnly ? "Recording is disabled in view mode" : "";

        return (
            <div style={[
                ShowModeComponent.styles.base
            ]}>
                {text}
            </div>
        );
    }

    private static styles = {
        base: {
            width: "100%"
        }
    }
}

export interface IShowModeComponentProps {
    viewOnly: boolean;
}

export interface IShowModeComponentState {
    text: string;
}