import * as React from "react";
import * as Radium from "radium";
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
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
            },
        };

        return (
            <div style={[SongSelectorComponent.styles.container]}>
                <ReactYoutube
                    videoId="HQnC1UHBvWA"
                    opts={opts}
                    onReady={this.props.onVideoReady}
                />
                <div style={[SongSelectorComponent.styles.overlay]}>

                </div>
            </div>
        );
    }

    private static readonly width = 640;
    private static readonly height = 390;

    private static styles = {
        container: {
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
    };
}

export interface ISongSelectorProps {
    onVideoReady: () => void;
}

export interface ISongSelectorState {

}