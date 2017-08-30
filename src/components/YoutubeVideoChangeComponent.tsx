import * as React from "react";
import * as Radium from "radium";
import {GlobalFont} from "../styles/GlobalStyles";

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
                GlobalFont
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
                    <span>  </span>
                    <input style={[YoutubeVideoChangeComponent.styles.button]}
                           type="button"
                           value="Cancel"
                           className="btn btn-default btn-sm"
                           disabled={!this.props.isEnabled}
                           onClick={this.handleCancel.bind(this)}/>
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

    private handleCancel(): void {
        if (this.props.isEnabled) {
            this.props.onChangeModalCancel();
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
            marginRight: "5px"
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
    onChangeModalCancel: () => void;
}

export interface IYoutubeVideoChangeComponentState {

}