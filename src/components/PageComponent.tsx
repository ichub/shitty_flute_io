import * as React from "react";
import {IFluteButtonInfo, makeIFluteButtonInfo} from "../models/IFluteButtonInfo";
import {FluteButton} from "./FluteButton";
import * as Radium from "radium";

@Radium
export class PageComponent extends React.Component<any, IPageComponentState> {
    public state: IPageComponentState;

    constructor(props) {
        super();

        this.state = {
            buttons: [
                makeIFluteButtonInfo("A"),
                makeIFluteButtonInfo("B"),
                makeIFluteButtonInfo("C"),
                makeIFluteButtonInfo("D"),
                makeIFluteButtonInfo("E"),
                makeIFluteButtonInfo("F"),
                makeIFluteButtonInfo("G"),
            ],
        };
    }

    public render() {
        return (
            <div>
                <div style={[
                    PageComponent.styles.base,
                ]}>
                    {
                        this.state.buttons.map(button => {
                            return <FluteButton key={button.name} buttonInfo={button}/>;
                        })
                    }
                </div>
            </div>
        );
    }

    private static styles = {
        base: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100vw",
            height: "100vh",
        },
    };
}

export interface IPageComponentState {
    buttons: IFluteButtonInfo[];
}