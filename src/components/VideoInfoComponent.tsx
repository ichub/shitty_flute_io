import * as React from "react";
import * as Radium from "radium";
import {GlobalFont} from "../styles/GlobalStyles";

const axios = require("axios");

@Radium
export class VideoInfo extends React.Component<IVideoInfoComponentProps, IVideoInfoComponentState> {
    props: IVideoInfoComponentProps;
    state: IVideoInfoComponentState;

    constructor(props: IVideoInfoComponentProps) {
        super();

        this.state = {
            thumbnailUrl: null,
            title: null
        };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        this.fetchIconUrl();
        this.fetchVideoTitle();
    }

    componentDidUpdate(prevProps: IVideoInfoComponentProps) {
        if (prevProps.youtubeVideoId != this.props.youtubeVideoId) {
            this.refresh();
        }
    }

    render() {
        let backgroundStyle = {};
        if (this.state.thumbnailUrl) {
            backgroundStyle = {
                backgroundImage: `url('${this.state.thumbnailUrl}')`
            }
        }

        return (
            <div style={[
                VideoInfo.styles.base,
                GlobalFont
            ]}>
                <span style={[
                    VideoInfo.styles.imgStyle,
                    backgroundStyle
                ]}>
                </span>
                <span style={[
                    GlobalFont,
                    VideoInfo.styles.title
                ]}>
                    {this.state.title}
                </span>
            </div>
        );
    }

    private fetchIconUrl() {
        axios.get(`/video-thubmnail-url/${this.props.youtubeVideoId}`)
            .then(result => {
                this.setState({
                    thumbnailUrl: result.data.url
                });
            });
    }

    private fetchVideoTitle() {
        axios.get(`/video-title/${this.props.youtubeVideoId}`)
            .then(result => {
                this.setState({
                    title: result.data.title
                });
            });
    }

    private static readonly WIDTH = 40;

    private static styles = {
        base: {
            width: "300px",
            margin: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            cursor: "pointer",
            padding: "20px",
            boxSizing: "border-box",
            ":hover": {
                backgroundColor: "rgba(0, 0, 0, 0.2)"
            }
        },
        imgStyle: {
            display: "inline-block",
            minWidth: `${VideoInfo.WIDTH}px`,
            width: `${VideoInfo.WIDTH}px`,
            height: `${VideoInfo.WIDTH * 3 / 4}px`,
            backgroundPosition: "50% 50%",
            backgroundSize: "cover",
            marginRight: "20px",
        },
        title: {
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
        }
    }
}

export interface IVideoInfoComponentProps {
    youtubeVideoId: string;
}

export interface IVideoInfoComponentState {
    thumbnailUrl: string;
    title: string;
}