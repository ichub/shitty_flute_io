import * as React from "react";
import * as Radium from "radium";
import {OpenSansFont} from "../styles/GlobalStyles";

@Radium
export class BufferingComponent extends React.Component<IBufferingComponentProps, IBufferingComponentState> {
    props: IBufferingComponentProps;
    state: IBufferingComponentState;

    render() {
        return (
            <div style={[
                OpenSansFont,
                BufferingComponent.styles.base]}>
                <span style={[
                    BufferingComponent.styles.bufferingText,
                    this.props.isBuffering ? {} : BufferingComponent.styles.notBuffering
                ]}>
                    Buffering
                </span>
            </div>
        );
    }

    private static styles = {
        base: {
            position: "absolute",
            top: "50px",
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        bufferingText: {
            transition: "200ms",
            opacity: 1,
            color: "white",
            fontWeight: "bold",
            fontSize: "1.5em",
            backgroundColor: "black",
            padding: "10px 20px",
            borderRadius: "5px"
        },
        notBuffering: {
            opacity: 0,
            display: "none",
        }
    };
}

export interface IBufferingComponentProps {
    isBuffering: boolean
}

export interface IBufferingComponentState {

}