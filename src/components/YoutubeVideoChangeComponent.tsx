import * as React from "react";
import * as Radium from "radium";

const getYoutubeId = require("get-youtube-id");

@Radium
export class YoutubeVideoChangeComponent extends React.Component<IYoutubeVideoChangeComponentProps, IYoutubeVideoChangeComponentState> {
    props: IYoutubeVideoChangeComponentProps;
    state: IYoutubeVideoChangeComponentState;

    refs: {
        youtubeInput: HTMLInputElement;
    };

    constructor(props: IYoutubeVideoChangeComponentProps) {
        super();

        console.log("FUCKKK");
    }

    render() {
        console.log("IS ENABLED " + !this.props.isEnabled);

        return (
            <div style={[
                YoutubeVideoChangeComponent.styles.base
            ]}>
                <label>
                    <span>YouTube URL:</span>
                    <input style={[]}
                           ref="youtubeInput"
                           type="text"
                           placeholder={"Paste URL here!"}/>
                    <input type="button"
                           value="Change Video"
                           disabled={!this.props.isEnabled}
                           onClick={this.handleVideoIdChange.bind(this)}/>
                </label>
            </div>
        );
    }

    private handleVideoIdChange(): void {
        if (this.props.isEnabled) {
            let videoId = getYoutubeId(this.refs.youtubeInput.value);
            if (videoId == null) {
                videoId = "";
            }
            this.props.onVideoIdChange(videoId);
        }
    }

    private static styles = {
        base: {
            width: "100%"
        }
    }
}

export interface IYoutubeVideoChangeComponentProps {
    isEnabled: boolean;
    onVideoIdChange: (id: string) => void;
}

export interface IYoutubeVideoChangeComponentState {

}