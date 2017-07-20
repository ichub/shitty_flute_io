import * as React from "react";
import * as Radium from "radium";

@Radium
export class ShareComponent extends React.Component<IShareComponentProps, IShareComponentState> {
    props: IShareComponentProps;
    state: IShareComponentState;

    constructor(props: IShareComponentProps) {
        super();
    }

    render() {
        return (
            <div style={[
                ShareComponent.styles.base
            ]}>
                {this.props.viewToken}
            </div>
        );
    }

    private static styles = {
        base: {
            width: "100%"
        }
    }
}

export interface IShareComponentProps {
    viewToken: string;
}

export interface IShareComponentState {

}