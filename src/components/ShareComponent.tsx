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
                <span
                    style={[ShareComponent.styles.url]}>{`http://floot.io/recorder/view/${this.props.viewToken}`}</span>
                <i style={[ShareComponent.styles.share]}
                   className="fa fa-files-o" aria-hidden="true"></i>
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
            borderRadius: "2px",
            backgroundColor: "rgb(220, 220, 220)",
            fontWeight: "bold",
            marginTop: "20px",
            marginBottom: "15px",
        },
        share: {
            margin: "10px",
            cursor: "pointer",
            ":hover": {
                color: "black"
            }
        }
    }
}

export interface IShareComponentProps {
    viewToken: string;
}

export interface IShareComponentState {

}