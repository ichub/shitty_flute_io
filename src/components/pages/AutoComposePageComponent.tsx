import * as React from "react";
import * as Radium from "radium";

@Radium
export class AutoComposePageComponent extends React.Component<IAutoComposePageComponentProps, IAutoComposePageComponentState> {
    props: IAutoComposePageComponentProps;
    state: IAutoComposePageComponentState;

    constructor(props: IAutoComposePageComponentProps) {
        super();
    }

    render() {
        return (
            <div style={[
                AutoComposePageComponent.styles.base
            ]}>
                AutoComposePageComponent
            </div>
        );
    }

    private static styles = {
        base: {
            width: "100%"
        }
    }
}

export interface IAutoComposePageComponentProps {
    isProd: boolean;
    editToken: string;
    viewToken: string;
}

export interface IAutoComposePageComponentState {

}