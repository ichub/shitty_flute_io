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
                code: {this.props.error.code}
                <br/>
                message: {this.props.error.message}
                <br/>
                {
                    this.props.isProd ? "" : "debug mode"
                }
                <br/>
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
    error: {
        message: string,
        code: number
    }
    isProd: boolean
}

export interface IErrorPageComponentState {

}