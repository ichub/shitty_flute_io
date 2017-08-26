import * as React from "react";
import * as Radium from "radium";

const axios = require("axios");

@Radium
export class VideoIconComponent extends React.Component<IVideoIconComponentProps, IVideoIconComponentState> {
    props: IVideoIconComponentProps;
    state: IVideoIconComponentState;

    constructor(props: IVideoIconComponentProps) {
        super();

        this.state = {
            thumbnailUrl: null
        };
    }

    componentDidMount() {
        this.fetchIconUrl();
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
                VideoIconComponent.styles.base
            ]}>
                <div style={[
                    VideoIconComponent.styles.imgStyle,
                    backgroundStyle
                ]}
                     src={this.state.thumbnailUrl || ""}>

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

    private static readonly WIDTH = 40;

    private static styles = {
        base: {
            width: "100%",
            margin: "20px"
        },
        imgStyle: {
            width: `${VideoIconComponent.WIDTH}px`,
            height: `${VideoIconComponent.WIDTH * 3 / 4}px`,
            backgroundPosition: "50% 50%",
            backgroundSize: "cover",
        }
    }
}

export interface IVideoIconComponentProps {
    youtubeVideoId: string;
}

export interface IVideoIconComponentState {
    thumbnailUrl: string;
}