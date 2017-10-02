import * as React from "react";
import * as Radium from "radium";
import * as color from "color";
import {NiceButton, TitleFont} from "../../styles/GlobalStyles";

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
                    <div style={[
                        LandingPageComponent.styles.pulse(0.50),
                        TitleFont
                    ]}>
                        <input
                            key="0"
                            style={[
                                NiceButton,
                            ]}
                            type="button"
                            value="FLOOTIFY"
                            onClick={this.onAutoComposeClick.bind(this)}/>

                        <input
                            key="1"
                            style={[
                                NiceButton,
                            ]}
                            type="button"
                            value="RECORD"
                            onClick={this.onComposeClick.bind(this)}/>
                    </div>
                </div>
                <div style={[
                    LandingPageComponent.styles.easeIn(0.7),
                    TitleFont
                ]}>
                    <input
                        key="2"
                        style={[
                            LandingPageComponent.styles.stanfordButton,
                        ]}
                        type="button"
                        value="(RECORDER CHOIR @ STANFORD)"
                        onClick={this.onStanfordClick.bind(this)}/>
                    <div style={{width: "100%", textAlign: "center"}}>
                        coming soon
                    </div>
                </div>
                <div style={[
                    TitleFont,
                    LandingPageComponent.styles.easeIn(0.8),
                    LandingPageComponent.styles.contact
                ]}>
                    contact: <a href="mailto:ivansergchub@gmail.com">ivan@floot.io</a> + <a href="mailto:briangu33@gmail.com">brian@floot.io</a>
                </div>
            </div>
        );
    }

    onAutoComposeClick() {
        window.location.href = "/auto-compose";
    }

    onComposeClick() {
        window.location.href = "/recorder";
    }

    onStanfordClick() {
        return;
    }

    private static readonly videoAspectRatio = 1920 / 1080;
    private static readonly videoWidth = 200;

    private static readonly pulseKeyframes = Radium.keyframes({
        "0%": {
            transform: "scale(0.9)",
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
            fontSize: "1.2em",
            opacity: 0.8,
            marginRight: "20px",
            ":hover": {
                fontWeight: "bold"
            },
        },
        advancedEditorButton: {
            padding: "10px 5px 10px 5px",
            backgroundColor: "white",
            color: "black",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2em",
            opacity: 0.8,
            ":hover": {
                fontWeight: "bold"
            },
        },
        stanfordButton: {
            padding: "10px 5px 10px 5px",
            backgroundColor: "white",
            color: "black",
            border: "none",
            cursor: "auto",
            fontSize: "1.2em",
            opacity: 0.8,
            ":hover": {
                fontWeight: "bold"
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
        contact: {
            marginTop: "15px",
            color: "rgba(0, 0, 0, 0.5)",
            fontSize: "1em"
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