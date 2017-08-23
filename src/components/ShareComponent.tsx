import * as React from "react";
import * as Radium from "radium";
import {GlobalFont} from "../styles/GlobalStyles";

@Radium
export class ShareComponent extends React.Component<IShareComponentProps, IShareComponentState> {
    props: IShareComponentProps;
    state: IShareComponentState;

    refs: {
        urlText: HTMLElement
    };

    constructor(props: IShareComponentProps) {
        super();
    }

    render() {
        return (
            <div style={[
                GlobalFont,
                ShareComponent.styles.base
            ]}>
                <span style={[ShareComponent.styles.sharePreamble]}>
                    share your creation:
                </span>
                <span
                    onClick={this.selectText.bind(this)}
                    ref="urlText"
                    style={[ShareComponent.styles.url]}>{`http://floot.io/recorder/view/${this.props.viewToken}`}</span>
            </div>
        );
    }

    selectText() {
        if (document["selection"]) {
            const range = document.body["createTextRange"]();
            range.moveToElementText(this.refs.urlText);
            range.select();
        } else if (window.getSelection()) {
            const range = document.createRange();
            range.selectNode(this.refs.urlText);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    }

    private static styles = {
        base: {
            display: "inline-block",
            opacity: 0.5,
            margin: "20px"
        },
        url: {
            padding: "5px 10px 5px 10px",
            borderRadius: "2px",
            backgroundColor: "rgb(220, 220, 220)",
            fontWeight: "bold",
            marginTop: "20px",
            marginBottom: "15px",
            cursor: "pointer",
        },
        share: {
            margin: "10px",
            cursor: "pointer",
            ":hover": {
                color: "black"
            }
        },
        sharePreamble: {
            opacity: 0.9,
            fontSize: "0.9em",
            height: "100%",
            lineHeight: "100%",
            textAlign: "center",
            marginRight: "10px",
        }
    }
}

export interface IShareComponentProps {
    viewToken: string;
}

export interface IShareComponentState {

}