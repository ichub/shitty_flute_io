import * as React from "react";
import * as Radium from "radium";
import {GlobalFont} from "../styles/GlobalStyles";

const getYoutubeId = require("get-youtube-id");

@Radium
export class UnavailableNoteModal extends React.Component<IUnavailableNoteModalProps, IUnavailableNoteModalState> {
    props: IUnavailableNoteModalProps;
    state: IUnavailableNoteModalState;

    refs: {
        youtubeInput: HTMLInputElement;
    };

    render() {
        return (
            <div style={[
                UnavailableNoteModal.styles.base,
                GlobalFont
            ]}>
                <label>
                    <span style={[UnavailableNoteModal.styles.header]}>Feature Unavailable</span>
                    <br/>
                    <input style={[UnavailableNoteModal.styles.videoIdInput]}
                           ref="youtubeInput"
                           type="text"
                           placeholder={"Paste URL here!"}
                           className="form-control form-control-sm"/>
                    <input style={[UnavailableNoteModal.styles.button]}
                           type="button"
                           value="Change Video"
                           className="btn btn-primary btn-sm"
                           disabled={!this.props.isEnabled}
                           onClick={this.handleVideoIdChange.bind(this)}/>
                    <span>  </span>
                    <input style={[UnavailableNoteModal.styles.button]}
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
            this.props.onDone();
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

export interface IUnavailableNoteModalProps {
    onDone: () => void;
}

export interface IUnavailableNoteModalState {

}