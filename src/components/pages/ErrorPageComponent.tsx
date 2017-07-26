import * as React from "react";
import * as Radium from "radium";

@Radium
export class ErrorPageComponent extends React.Component<IErrorPageComponentProps, IErrorPageComponentState> {
    props: IErrorPageComponentProps;
    state: IErrorPageComponentState;

    constructor(props: IErrorPageComponentProps) {
        super();
    }

    render() {
        return (
            <div style={[
                ErrorPageComponent.styles.base
            ]}>
                Looks like there was an error
            </div>
        );
    }

    private static styles = {
        base: {
            width: "100%"
        }
    }
}

export interface IErrorPageComponentProps {

}

export interface IErrorPageComponentState {

}