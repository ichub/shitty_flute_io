import * as React from "react";
import * as Radium from "radium";
import {ICompositionState} from "../../models/ICompositionState";
import {GlobalButton, TitleFont, BoxShadow, OpenSansFont} from "../../styles/GlobalStyles";
import Marquee from 'react-text-marquee';

const getYoutubeId = require("get-youtube-id");
const axios = require("axios");

@Radium
export class AutoComposePageComponent extends React.Component<IAutoComposePageComponentProps, IAutoComposePageComponentState> {
    props: IAutoComposePageComponentProps;
    state: IAutoComposePageComponentState;

    refs: {
        youtubeLink: HTMLInputElement
    };

    constructor(props: IAutoComposePageComponentProps) {
        super();

        this.state = {
            stateName: AutoComposeStateName.Loading,
            composition: null,
            flootified: false,
            youtubeVideoId: ""
        };
    }

    componentDidMount() {
        this.load();
    }

    load() {
        console.log("loading");

        axios.get(`/recorder/${this.props.editToken}/data`)
            .then((result) => {
                console.log("here's the result i got back:");
                console.log(result);
                let compositionState = result.data as ICompositionState;
                console.log("load complete");

                if (compositionState.hasRecorded) {
                    this.setState({
                        composition: compositionState,
                        stateName: AutoComposeStateName.Idle,
                        flootified: true,
                        youtubeVideoId: compositionState.youtubeVideoId
                    });
                }

                this.setState({
                    stateName: AutoComposeStateName.Idle,
                })
            });
    }

    getCurrentVideoUrl(): string {
        if (this.state.youtubeVideoId !== null && this.state.youtubeVideoId.length != 0) {
            return `https://www.youtube.com/watch?v=${this.state.youtubeVideoId}`
        }

        return "";
    }

    render() {
        return (
            <div style={[
                AutoComposePageComponent.styles.base
            ]}>
                <div>
                    <label>
                        <input style={[AutoComposePageComponent.styles.youtubeInput]}
                               ref="youtubeLink"
                               type="text"
                               defaultValue={this.getCurrentVideoUrl()}
                               className="form-control form-control-sm"/>
                    </label>
                </div>

                <div style={[BoxShadow, AutoComposePageComponent.styles.videoInfo]}>
                    <div style={AutoComposePageComponent.styles.videoIcon}>

                    </div>

                    <div style={[OpenSansFont, AutoComposePageComponent.styles.videoTitleContainer]}>
                        <div style={AutoComposePageComponent.styles.videoTitle}>
                            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
                        </div>
                    </div>
                </div>

                {/*<a href={`/recorder/view/${this.props.viewToken}`}>view your creation!</a>*/}
            </div>
        );
    }

    onSubmitClick() {
        if (this.state.stateName !== AutoComposeStateName.Idle) {
            return;
        }

        let videoId = getYoutubeId(this.refs.youtubeLink.value);

        console.log(`new youtube url: ${videoId}`);

        if (videoId !== null) {
            this.flootify(videoId);
        } else {
            console.log("youtube link was invalid");
        }
    }

    flootify(videoId: string) {
        this.setState({
            stateName: AutoComposeStateName.Flootifying,
            youtubeVideoId: videoId,
        });

        axios.get(`/flootify/${videoId}`)
            .then((result) => {
                console.log("flootify complete");
                const comp = result.data as ICompositionState;

                this.setState({
                    stateName: AutoComposeStateName.Idle,
                    composition: comp,
                    flootified: true,
                    youtubeVideoId: comp.youtubeVideoId
                }, () => {
                    this.save();
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    save() {
        this.setState({
            stateName: AutoComposeStateName.Saving
        }, () => {
            axios.post(`/recorder/${this.props.editToken}/save`, this.state.composition)
                .then((result) => {
                    console.log("save complete");
                    this.setState({
                        stateName: AutoComposeStateName.Idle,
                        flootified: true,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    }

    private static readonly InfoHeight = "100px";
    private static readonly InfoWidth = "350px";
    private static readonly Margin = "10px";

    private static styles = {
        base: {
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
        },
        youtubeInput: {
            width: "500px"
        },
        videoInfo: {
            margin: "25px",
            width: AutoComposePageComponent.InfoWidth,
            height: AutoComposePageComponent.InfoHeight,
            borderRadius: "2px",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
            padding: AutoComposePageComponent.Margin,
        },
        videoIcon: {
            width: `calc(${AutoComposePageComponent.InfoHeight} - ${AutoComposePageComponent.Margin} * 2)`,
            height: `calc(${AutoComposePageComponent.InfoHeight} - ${AutoComposePageComponent.Margin} * 2)`,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            display: "inline-block",
            float: "left"
        },
        videoTitleContainer: {
            display: "inline-block",
            width: "auto",
            float: "left",
            marginLeft: AutoComposePageComponent.Margin,
            width: `calc(${AutoComposePageComponent.InfoWidth} - ${AutoComposePageComponent.InfoHeight} - ${AutoComposePageComponent.Margin})`,
            color: "rgba(0, 0, 0, 0.9)",
            fontWeight: "bold",
            userSelect: "none",
        },
        videoTitle: {
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            lineHeight: "1em",
            height: "2em",
        }
    };
}

enum AutoComposeStateName {
    Loading = "loading",
    Saving = "saving",
    Idle = "idle",
    Flootifying = "flootifying",
}

export interface IAutoComposePageComponentProps {
    isProd: boolean;
    editToken: string;
    viewToken: string;
}

export interface IAutoComposePageComponentState {
    youtubeVideoId: string;
    stateName: AutoComposeStateName;
    composition: ICompositionState;
    flootified: boolean;
}