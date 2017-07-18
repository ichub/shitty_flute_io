import * as React from "react";
import * as Radium from "radium";
import * as color from "color";

@Radium
export class LoadingOverlayComponent extends React.Component<ILoadingOverlayComponentProps, ILoadingOverlayComponentState> {
    props: ILoadingOverlayComponentProps;
    state: ILoadingOverlayComponentState;

    constructor(props: ILoadingOverlayComponentProps) {
        super();
    }

    render() {
        return (
            <div style={[
                LoadingOverlayComponent.styles.base,
                LoadingOverlayComponent.styles.visible(this.props.visible),
            ]}>
                LoadingOverlayComponent
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
            backgroundColor: color("white").alpha(0.5),
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