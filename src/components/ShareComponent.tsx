import * as React from "react";
import * as Radium from "radium";
import {GlobalFont} from "../styles/GlobalStyles";

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
                GlobalFont,
                ShareComponent.styles.base
            ]}>
                share your creation:
                <span style={[ShareComponent.styles.url]}>{`http://flute.io/view/${this.props.viewToken}`}</span>
            </div>
        );
    }

    private static styles = {
        base: {
            display: "inline-block",
            opacity: 0.5
        },
        url: {
            padding: "5px 10px 5px 10px",
            borderRadius: "5px",
            backgroundColor: "rgb(220, 220, 220)",
            fontWeight: "bold",
            margin: "20px",
        }
    }
}

export interface IShareComponentProps {
    viewToken: string;
}

export interface IShareComponentState {

}