import * as React from "react";
import * as Radium from "radium";

@Radium
export class AboutPageComponent extends React.Component<IAboutPageComponentProps, IAboutPageComponentState> {
    props: IAboutPageComponentProps;
    state: IAboutPageComponentState;

    constructor(props: IAboutPageComponentProps) {
        super();
    }

    render() {
        return (
            <div style={[
                AboutPageComponent.styles.base
            ]}>
                AboutPageComponent
            </div>
        );
    }

    private static styles = {
        base: {
            width: "100%"
        }
    }
}

export interface IAboutPageComponentProps {

}

export interface IAboutPageComponentState {

}