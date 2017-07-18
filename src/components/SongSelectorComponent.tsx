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
            height: "390",
            width: "640",
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
            },
        };

        return (
            <ReactYoutube
                videoId="HQnC1UHBvWA"
                opts={opts}
                onReady={this.props.onVideoReady}
            />
        );
    }

    private static styles = {
        base: {
            width: "100vw",
            height: "50vh",

        },
    };
}

export interface ISongSelectorProps {
    onVideoReady: () => void;
}

export interface ISongSelectorState {

}