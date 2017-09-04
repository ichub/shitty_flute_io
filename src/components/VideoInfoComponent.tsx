import * as React from "react";
import * as Radium from "radium";
import {OpenSansFont} from "../styles/GlobalStyles";

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
        if (this.state.thumbnailUrl) {
            this.refresh();
        }
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
                OpenSansFont
            ]}
                 onClick={this.props.openModal}>
                <span style={[
                    VideoInfo.styles.imgStyle,
                    backgroundStyle
                ]}>
                </span>
                <span style={[
                    OpenSansFont,
                    VideoInfo.styles.title
                ]}>
                    {this.state.title}
                </span>
            </div>
        );
    }

    private fetchIconUrl() {
        axios.get(`/video-thumbnail-url/${this.props.youtubeVideoId}`)
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
            textOverflow: "ellipsis",
            fontWeight: "bold",
            fontSize: "1.2em",
        }
    }
}

export interface IVideoInfoComponentProps {
    youtubeVideoId: string;
    openModal: () => void;
}

export interface IVideoInfoComponentState {
    thumbnailUrl: string;
    title: string;
}