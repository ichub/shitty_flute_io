import * as React from "react";
import * as Radium from "radium";
import {ICompositionState} from "../../models/ICompositionState";
import {GlobalButton, TitleFont, BoxShadow, OpenSansFont, ModalStyle} from "../../styles/GlobalStyles";
import {parse as parseDuration} from 'iso8601-duration';
import * as roundPrecision from "round-precision";
import ReactModal = require("react-modal");

const getYoutubeId = require("get-youtube-id");
const axios = require("axios");

@Radium
export class AutoComposePageComponent extends React.Component<IAutoComposePageComponentProps, IAutoComposePageComponentState> {
    props: IAutoComposePageComponentProps;
    state: IAutoComposePageComponentState;

    constructor(props: IAutoComposePageComponentProps) {
        super();

        this.state = {
            stateName: AutoComposeStateName.Loading,
            composition: null,
            flootified: false,
            youtubeVideoId: "",
            youtubeVideoLink: "",
            videoInfo: {
                title: null,
                thumbnails: {
                    default: {url: null, width: 0, height: 0},
                    high: {url: null, width: 0, height: 0},
                    maxres: {url: null, width: 0, height: 0},
                    medium: {url: null, width: 0, height: 0},
                    standard: {url: null, width: 0, height: 0},
                },
                channelTitle: null,
                statistics: {
                    commentCount: null,
                    dislikeCount: null,
                    favoriteCount: null,
                    likeCount: null,
                    viewCount: null,
                },
                duration: null
            },
            errorMessage: null,
        };
    }

    loadVideoInfo() {
        axios.get(`/video-info/${this.state.youtubeVideoId}`)
            .then(result => {
                console.log(result.data);
                let info = result.data.snippet.items[0].snippet;
                info.statistics = result.data.detail.items[0].statistics;
                info.duration = result.data.detail.items[0].contentDetails.duration;

                this.setState({
                    videoInfo: info
                });
            });
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
                    }, () => {
                        if (compositionState.youtubeVideoId) {
                            this.loadVideoInfo();
                        }
                    });
                }

                this.setState({
                    stateName: AutoComposeStateName.Idle,
                })
            });
    }

    getValidInputClass(): string {
        if (this.state.youtubeVideoLink) {
            if (getYoutubeId(this.state.youtubeVideoLink)) {
                return "is-valid"
            }
            return "is-invalid"
        }
        return "";
    }

    onYoutubeVideoLinkChange(event) {
        this.setState({youtubeVideoLink: event.target.value});

        const youtubeVideoId = getYoutubeId(event.target.value);

        if (youtubeVideoId) {
            this.setState({
                youtubeVideoId: youtubeVideoId
            }, () => {
                this.loadVideoInfo();
            });
        } else {

        }
    }

    durationToString() {
        if (this.state.videoInfo.duration) {
            const parsed = parseDuration(this.state.videoInfo.duration);

            let result = "";

            if (parsed.seconds) {
                result = parsed.seconds + result;
            }

            if (parsed.minutes) {
                result = parsed.minutes + ":" + result;
            } else {
                result = "00:" + result;
            }

            if (parsed.hours) {
                result = parsed.hours + ":" + result;
            }

            return result;
        }

        return "";
    }

    viewCountToString() {
        if (this.state.videoInfo.statistics.viewCount) {
            const actualCount = parseInt(this.state.videoInfo.statistics.viewCount, 10);

            if (actualCount >= 1000 * 1000) {
                return roundPrecision(actualCount / (1000 * 1000), 1) + " M"
            }

            if (actualCount >= 1000 * 10) {
                return roundPrecision(actualCount / (1000), 1) + " k views"

            }

            return actualCount;
        }

        return "";
    }

    render() {
        return (
            <div style={[
                AutoComposePageComponent.styles.base
            ]}>
                {
                    (!this.state.flootified && this.state.stateName === AutoComposeStateName.Idle) ?
                        <div style={AutoComposePageComponent.styles.flex}>
                            <div style={[AutoComposePageComponent.styles.title, TitleFont]}>
                                Paste the youtube link you want to flootify below (:
                            </div>
                            <label>
                                <input style={[AutoComposePageComponent.styles.youtubeInput]}
                                       ref="youtubeLink"
                                       type="text"
                                       value={this.state.youtubeVideoLink}
                                       onChange={this.onYoutubeVideoLinkChange.bind(this)}
                                       className={`form-control form-control-sm ${this.getValidInputClass()}`}/>
                            </label>
                        </div> :
                        null
                }


                <div style={[
                    AutoComposePageComponent.styles.videoInfo,
                    (this.state.youtubeVideoId ? this.easeIn(0) : {})]}>
                    <div style={[AutoComposePageComponent.styles.videoInfoContent, BoxShadow]}>
                        <div style={AutoComposePageComponent.styles.videoIconContainer}>
                            <div style={
                            [AutoComposePageComponent.styles.videoIcon,
                            {
                                backgroundImage: `url('${this.state.videoInfo.thumbnails.medium.url || ""}')`
                            }]}>
                            </div>
                        </div>

                        <div style={[OpenSansFont, AutoComposePageComponent.styles.videoTitleContainer]}>
                            <div style={AutoComposePageComponent.styles.videoTitle}>
                                {this.state.videoInfo.title}
                            </div>
                            <div style={AutoComposePageComponent.styles.miscVideoInfo}>
                                {this.durationToString()}
                            </div>
                            <div style={AutoComposePageComponent.styles.miscVideoInfo}>
                                {this.viewCountToString()}
                            </div>
                        </div>
                    </div>
                </div>

                {
                    !this.state.flootified ?
                        <div style={[,
                            AutoComposePageComponent.styles.composeButton,
                            TitleFont,
                            (this.state.youtubeVideoId) ? this.easeIn(0.25) : {}
                        ]}>
                            <input key="compose" disabled={this.state.stateName !== AutoComposeStateName.Idle}
                                   style={GlobalButton} type="button"
                                   value={this.state.stateName == AutoComposeStateName.Flootifying ? "flootifying..." : "flootify"}
                                   onClick={this.flootify.bind(this)}/>
                        </div> :
                        null
                }

                <div style={[
                    AutoComposePageComponent.styles.viewYourCreation,
                    TitleFont,
                    this.state.flootified ? this.easeIn(0.25) : {}
                ]}>
                    <a href={`/recorder/view/${this.props.viewToken}`}>view your creation!</a>
                </div>

                <ReactModal
                    isOpen={!!this.state.errorMessage}
                    style={ModalStyle}
                    contentLabel="unavailable"
                    onRequestClose={() => this.setState({errorMessage: null})}>
                    <div style={TitleFont}>
                        <b>Error Flootifying</b> <br/>

                        {this.state.errorMessage}
                    </div>

                </ReactModal>
            </div>
        );
    }

    flootify() {
        if (this.state.stateName === AutoComposeStateName.Idle) {
            this.setState({
                stateName: AutoComposeStateName.Flootifying,
            }, () => {
                axios.get(`/flootify/${this.state.youtubeVideoId}`)
                    .then((result) => {
                        if (result.status === 200) {
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
                        } else {
                            console.log("flootify error");
                        }
                    })
                    .catch((err) => {
                        this.setState({
                            stateName: AutoComposeStateName.Idle,
                            errorMessage: err.response.data.toString(),
                        });
                    });
            });
        }
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

    easeIn(offset: number) {
        return {
            opacity: 0,
            animation: `x 1s ${offset}s ease forwards`,
            animationName: AutoComposePageComponent.fadeInKeyframes,
        }
    }

    private static styles = {
        base: {
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            backgroundColor: "rgba(0, 0, 0, 0.02)",

        },
        flex: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexFlow: "column",
        },
        title: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "20px",
            fontSize: "2em"
        },
        viewYourCreation: {
            fontSize: "2em",
            opacity: 0,
        },
        youtubeInput: {
            width: "500px"
        },
        videoInfo: {
            opacity: 0,
            margin: "25px",
        },
        composeButton: {
            opacity: 0,
        },
        videoInfoContent: {
            transition: "200ms",
            width: AutoComposePageComponent.InfoWidth,
            height: AutoComposePageComponent.InfoHeight,
            borderRadius: "2px",
            backgroundColor: "white",
            overflow: "hidden",
            padding: AutoComposePageComponent.Margin,
        },
        videoIconContainer: {
            width: `calc(${AutoComposePageComponent.InfoHeight} - ${AutoComposePageComponent.Margin} * 2)`,
            height: `calc(${AutoComposePageComponent.InfoHeight} - ${AutoComposePageComponent.Margin} * 2)`,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            display: "inline-block",
            float: "left"
        },
        videoIcon: {
            width: "100%",
            height: "100%",
            backgroundPosition: "50% 50%",
            backgroundSize: "cover",
        },
        videoTitleContainer: {
            display: "inline-block",
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
            height: "1.5em",
            marginBottom: "5px"
        },
        miscVideoInfo: {
            color: "rgba(0, 0, 0, 0.7)",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            lineHeight: "1em",
            height: "1.5em",
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

export interface IVideoInfo {
    title: string,
    thumbnails: {
        default: {url: string, width: number, height: number},
        high: {url: string, width: number, height: number},
        maxres: {url: string, width: number, height: number},
        medium: {url: string, width: number, height: number},
        standard: {url: string, width: number, height: number},
    },
    channelTitle: string,
    statistics: {
        commentCount: string;
        dislikeCount: string;
        favoriteCount: string;
        likeCount: string;
        viewCount: string;
    },
    duration: "string"
}

export interface IAutoComposePageComponentState {
    youtubeVideoId: string;
    stateName: AutoComposeStateName;
    composition: ICompositionState;
    flootified: boolean;
    youtubeVideoLink: string;
    videoInfo: IVideoInfo;
    errorMessage: string;
}