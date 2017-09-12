import * as React from "react";
import * as Radium from "radium";
import {OpenSansFont, TitleFont} from "../styles/GlobalStyles";

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

        const hideStyle = {
            display: this.props.hide ? "none" : "initial",
        };

        return (
            <div style={[
                VideoPlayer.styles.base,
                hideStyle
            ]}>
                <div style={[VideoPlayer.styles.videoContainer]}>
                    <ReactYoutube
                        videoId={this.props.videoId}
                        opts={opts}
                        onReady={this.props.onVideoReady}
                        onStateChange={this.props.onStateChange}
                    />
                    {
                        !this.props.canInteract ?
                            <div style={[
                                TitleFont,
                                VideoPlayer.styles.overlay
                            ]}>
                            </div> :
                            null
                    }
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "black",
            backgroundColor: "rgba(255, 255, 255, 0.3)"
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
    onStateChange: () => void;
    videoId: string;
    canInteract: boolean;
    hide: boolean;
}

export interface IVideoPlayerState {
}

export interface IYoutubeVideoPlayer {
    pauseVideo(): void;

    playVideo(): void;

    getCurrentTime(): number;

    seekTo(time: number);

    setVolume(volume: number): void;

    getVolume(): number;

    getDuration(): number;
}