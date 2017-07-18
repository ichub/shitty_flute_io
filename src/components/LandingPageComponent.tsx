import * as React from "react";
import * as Radium from "radium";

@Radium
export class LandingPageComponent extends React.Component<any, ILandingPageComponentState> {
    public render() {
        return (
            <div>
                <div style={[
                    LandingPageComponent.styles.base,
                ]}>
                    <div style={[LandingPageComponent.styles.title]}>shitty recorder</div>
                    <input
                        style={[LandingPageComponent.styles.composeButton]}
                        type="button"
                        value="compose"
                        onClick={this.onComposeClick.bind(this)}/>
                </div>
            </div>
        );
    }

    onComposeClick() {
        window.location.href = "/composer";
    }

    private static styles = {
        base: {
            fontFamily: "'Oswald', sans-serif",
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
        },
        title: {
            fontSize: "4em",
            color: "white",
            backgroundColor: "black",
        },
        composeButton: {
            padding: "10px 5px",
            margin: "50px",
            backgroundColor: "white",
            color: "black",
            border: "none",
            fontFamily: "inherit",
            textDecoration: "underline",
            cursor: "pointer",
            ":hover": {
                color: "white",
                backgroundColor: "black",
            },
        },
    };
}

export interface ILandingPageComponentState {
}