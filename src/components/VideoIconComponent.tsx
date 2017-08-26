import * as React from "react";
import * as Radium from "radium";

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
        this.fetchIconUrl();
        this.fetchVideoTitle();
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
                VideoInfo.styles.base
            ]}>
                <div style={[
                    VideoInfo.styles.imgStyle,
                    backgroundStyle
                ]}>
                </div>
                <div>
                    {this.state.title}
                </div>
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
            width: "100%",
            margin: "20px"
        },
        imgStyle: {
            width: `${VideoInfo.WIDTH}px`,
            height: `${VideoInfo.WIDTH * 3 / 4}px`,
            backgroundPosition: "50% 50%",
            backgroundSize: "cover",
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