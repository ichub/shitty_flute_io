import * as React from "react";
import * as Radium from "radium";
import {GlobalFont} from "../styles/GlobalStyles";

const axios = require("axios");
const ReactYoutube = require("react-youtube").default as any;

@Radium
export class VideoPlayer extends React.Component<IVideoPlayerProps, IVideoPlayerState> {
    props: IVideoPlayerProps;
    state: IVideoPlayerState;

    render() {
        const opts = {
            height: VideoPlayer.height,
            width: VideoPlayer.width,
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 0,
                //controls: 0,
                disablekb: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
            },
        };

        return (
            <div style={[VideoPlayer.styles.base]}>
                <div style={[VideoPlayer.styles.videoContainer]}>
                    <ReactYoutube
                        videoId={this.props.videoId}
                        opts={opts}
                        onReady={this.props.onVideoReady}
                    />
                    {
                        !this.props.canInteract ?
                            <div style={[VideoPlayer.styles.overlay]}>

                            </div> :
                            null
                    }
                </div>
                <div style={[
                    GlobalFont,
                    VideoPlayer.styles.videoTitle,
                ]}>
                </div>
            </div>
        );
    }

    private static readonly width = 320;
    private static readonly height = 195;

    private static styles = {
        base: {
            width: VideoPlayer.width,
            margin: "50px",
        },
        videoContainer: {
            width: VideoPlayer.width + "px",
            height: VideoPlayer.height + "px",
            position: "relative",
        },
        overlay: {
            width: VideoPlayer.width + "px",
            height: VideoPlayer.height + "px",
            position: "absolute",
            top: 0,
            left: 0,
        },
        videoTitle: {
            fontSize: "0.9em",
            fontWeight: "bold",
            marginTop: "5px",
            width: "100%",
            textAlign: "center",
        },
    };
}

export interface IVideoPlayerProps {
    onVideoReady: () => void;
    videoId: string;
    canInteract: boolean;
}

export interface IVideoPlayerState {
}

export interface IYoutubeVideoPlayer {
    pauseVideo(): void;

    playVideo(): void;

    getCurrentTime(): number;

    seekTo(time: number);
}