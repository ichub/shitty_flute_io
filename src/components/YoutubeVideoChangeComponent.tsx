import * as React from "react";
import * as Radium from "radium";
import {OpenSansFont} from "../styles/GlobalStyles";

const getYoutubeId = require("get-youtube-id");

@Radium
export class YoutubeVideoChangeComponent extends React.Component<IYoutubeVideoChangeComponentProps, IYoutubeVideoChangeComponentState> {
    props: IYoutubeVideoChangeComponentProps;
    state: IYoutubeVideoChangeComponentState;

    refs: {
        youtubeInput: HTMLInputElement;
    };

    render() {
        return (
            <div style={[
                YoutubeVideoChangeComponent.styles.base,
                OpenSansFont
            ]}>
                <label>
                    <span style={[YoutubeVideoChangeComponent.styles.header]}>Change YouTube Url</span>
                    <br/>
                    <input style={[YoutubeVideoChangeComponent.styles.videoIdInput]}
                           ref="youtubeInput"
                           type="text"
                           placeholder={"Paste URL here!"}
                           className="form-control form-control-sm"/>
                    <input style={[YoutubeVideoChangeComponent.styles.button]}
                           type="button"
                           value="Change Video"
                           className="btn btn-primary btn-sm"
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
        },
        videoIdInput: {
            display: "inline-block",
            marginTop: "40px",
            marginBottom: "10px"
        },
        button: {
            marginLeft: "5px",
            marginRight: "5px",
            cursor: "pointer",
        },
        header: {
            fontWeight: "bold",
            fontSize: "1em",
            marginBottom: "30px",
        }
    }
}

export interface IYoutubeVideoChangeComponentProps {
    isEnabled: boolean;
    onVideoIdChange: (id: string) => void;
}

export interface IYoutubeVideoChangeComponentState {

}