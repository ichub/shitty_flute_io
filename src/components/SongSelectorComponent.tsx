import * as React from "react";
import * as Radium from "radium";
import {GlobalFont} from "../styles/GlobalStyles";
const axios = require("axios");
const ReactYoutube = require("react-youtube").default as any;

@Radium
export class SongSelectorComponent extends React.Component<ISongSelectorProps, ISongSelectorState> {
    props: ISongSelectorProps;
    state: ISongSelectorState;

    render() {
        const opts = {
            height: SongSelectorComponent.height,
            width: SongSelectorComponent.width,
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
            },
        };

        return (
            <div style={[SongSelectorComponent.styles.base]}>
                <div style={[SongSelectorComponent.styles.videoContainer]}>
                    <ReactYoutube
                        videoId="HQnC1UHBvWA"
                        opts={opts}
                        onReady={this.props.onVideoReady}
                    />
                    <div style={[SongSelectorComponent.styles.overlay]}>

                    </div>
                </div>
                <div style={[
                    GlobalFont,
                    SongSelectorComponent.styles.videoTitle,
                ]}>
                    {this.props.videoTitle}
                </div>
            </div>
        );
    }

    private static readonly width = 320;
    private static readonly height = 195;

    private static styles = {
        base: {
            width: SongSelectorComponent.width,
            margin: "50px",
            display: "none",
        },
        videoContainer: {
            width: SongSelectorComponent.width + "px",
            height: SongSelectorComponent.height + "px",
            position: "relative",
        },
        overlay: {
            width: SongSelectorComponent.width + "px",
            height: SongSelectorComponent.height + "px",
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

export interface ISongSelectorProps {
    onVideoReady: () => void;
    videoTitle: string;
}

export interface ISongSelectorState {

}