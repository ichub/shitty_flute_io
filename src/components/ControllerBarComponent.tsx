import * as React from "react";
import * as Radium from "radium";

@Radium
export class ControllerBarComponent extends React.Component<IControllerBarComponentProps, IControllerBarComponentState> {
    props: IControllerBarComponentProps;
    state: IControllerBarComponentState;

    constructor(props: IControllerBarComponentProps) {
        super();
    }

    render() {
        return (
            <div style={[
                ControllerBarComponent.styles.base
            ]}>
                ControllerBarComponent
            </div>
        );
    }

    private static styles = {
        base: {
            width: "100%",
            height: "60",
            position: "fixed",
            bottom: "0",
            left: "0",
            backgroundColor: "rgb(240, 240, 240)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }
    }
}

export interface IControllerBarComponentProps {

}

export interface IControllerBarComponentState {

}