import * as React from "react";
import * as Radium from "radium";
import * as color from "color";
import {ButtonFont, GlobalFont, TitleFont} from "../../styles/GlobalStyles";

@Radium
export class LandingPageComponent extends React.Component<any, ILandingPageComponentState> {
    public render() {
        return (
            <div style={[
                LandingPageComponent.styles.base,
            ]}>
                <div style={[
                    TitleFont,
                    LandingPageComponent.styles.title,
                    LandingPageComponent.styles.easeIn(0),
                ]}>
                    floot
                </div>
                <div style={[
                    TitleFont,
                    LandingPageComponent.styles.subtitle,
                    LandingPageComponent.styles.easeIn(0.1),
                ]}>
                    make recorder covers of everything
                </div>
                <div style={[
                    LandingPageComponent.styles.videoContainer,
                    LandingPageComponent.styles.easeIn(0.25),
                ]}>
                    <video style={[
                        LandingPageComponent.styles.videoElement,
                    ]}
                           muted={true}
                           autoPlay={true}
                           controls={false}
                           loop={true}>
                        <source src="/res/videos/floot.mp4"/>
                    </video>
                </div>
                <div style={[
                    LandingPageComponent.styles.easeIn(0.50),
                ]}>
                    <input
                        style={[
                            GlobalFont,
                            LandingPageComponent.styles.composeButton,
                            LandingPageComponent.styles.pulse(0.50),
                        ]}
                        type="button"
                        value="RECORD"
                        onClick={this.onComposeClick.bind(this)}/>
                </div>
            </div>
        );
    }

    onComposeClick() {
        window.location.href = "/recorder";
    }

    private static readonly videoAspectRatio = 1920 / 1080;
    private static readonly videoWidth = 200;

    private static readonly pulseKeyframes = Radium.keyframes({
        "0%": {
            transform: "scale(0.5)",
        },
        "100%": {
            transform: "scale(1)",
        },
    }, "pulse");

    private static readonly fadeInKeyframes = Radium.keyframes({
        "0%": {
            opacity: 0,
            transform: "translatey(-10px)",
        },
        "100%": {
            opacity: 1,
            transform: "translatey(0px  )",
        },
    }, "fadeIn");

    private static styles = {
        base: {
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
        },
        title: {
            fontSize: "4em",
        },
        subtitle: {
            fontSize: "1.5em",
        },
        composeButton: {
            padding: "10px 5px 10px 5px",
            backgroundColor: "white",
            color: "black",
            border: "none",
            cursor: "pointer",
            transition: "200ms",
            fontSize: "1.5em",
            ":hover": {
                textDecoration: "underline",
            },
        },
        videoContainer: {
            width: LandingPageComponent.videoWidth + "px",
            height: LandingPageComponent.videoWidth * LandingPageComponent.videoAspectRatio + "px",
            backgroundColor: color("white").darken(0.5).hex(),
            margin: "50px",
        },
        videoElement: {
            width: "100%",
            height: "100%",
        },
        pulse: (offset: number) => {
            return {
                animation: `x 0.75s ${offset}s ease forwards`,
                animationName: LandingPageComponent.pulseKeyframes,
            };
        },
        easeIn: (offset: number) => {
            return {
                opacity: 0,
                animation: `x 1s ${offset}s ease forwards`,
                animationName: LandingPageComponent.fadeInKeyframes,
            };
        },
        insta: {
            color: "rgba(0, 0, 0, 0.1)",
            textDecoration: "none",

            ":hover": {
                color: "rgba(0, 0, 0, 0.5)",

            }
        },
        instaContainer: {
            "marginTop": "50px"
        }
    };
}

export interface ILandingPageComponentState {
}