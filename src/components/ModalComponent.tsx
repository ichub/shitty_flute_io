import * as React from "react";
import * as Radium from "radium";

@Radium
export class ModalComponent extends React.Component<IModalComponentProps, IModalComponentState> {
    render() {
        return this.props.visible ?
            (
                <div style={[
                    ModalComponent.styles.base,
                ]}>
                    <div onClick={this.props.onHide} style={[ModalComponent.styles.flex]}>
                        <div onClick={this.onModalClick.bind(this)} style={[ModalComponent.styles.container]}>
                            {this.props.children}
                        </div>
                    </div>

                </div>
            )
            : null;
    }

    onModalClick(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
    }

    private static styles = {
        base: {
            width: "100vw",
            height: "100vh",
            position: "fixed",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            top: 0,
            left: 0,
        },
        flex: {
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        },
        container: {
            width: "800px",
            height: "400px",
        },
    };
}

export interface IModalComponentProps {
    visible: boolean;
    onHide(): void;
}

export interface IModalComponentState {
}