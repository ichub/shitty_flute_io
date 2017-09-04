import * as React from "react";
import * as Radium from "radium";
import * as color from "color";
import {OpenSansFont} from "../styles/GlobalStyles";

@Radium
export class LoadingOverlayComponent extends React.Component<ILoadingOverlayComponentProps, ILoadingOverlayComponentState> {
    props: ILoadingOverlayComponentProps;
    state: ILoadingOverlayComponentState;

    render() {
        return (
            <div style={[
                OpenSansFont,
                LoadingOverlayComponent.styles.base,
                LoadingOverlayComponent.styles.visible(this.props.visible),
            ]}>
                <div style={[
                    LoadingOverlayComponent.styles.flex,
                ]}>
                    Loading...
                </div>
            </div>
        );
    }

    private static styles = {
        base: {
            width: "100vw",
            height: "100vh",
            position: "fixed",
            zIndex: "100",
            top: "0",
            left: "0",
            backgroundColor: color("white").alpha(0.8),
        },
        flex: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
        },
        visible: (visible: boolean) => {
            return {
                display: visible ? "initial" : "none",
            };
        },
    };
}

export interface ILoadingOverlayComponentProps {
    visible: boolean;
}

export interface ILoadingOverlayComponentState {

}