import * as React from "react";
import * as Radium from "radium";
import {OpenSansFont, TitleFont} from "../styles/GlobalStyles";
import {RecorderPlayerPageComponent} from "./pages/RecorderPlayerPageComponent";

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
                OpenSansFont
            ]}>
                <label>
                    <div style={[UnavailableNoteModal.styles.header]}>Feature Unavailable</div>

                    <br/>

                    <div>
                        Sorry, this note (low D#) is not available in the current version of  <span style={[TitleFont]}> floot.io</span>.
                        <br/>
                        Please check back regularly for more updates and new features, including auto-flootify and adjustable audio quality levels!
                    </div>

                    <br/>

                    <input style={[UnavailableNoteModal.styles.button]}
                           type="button"
                           value="OK"
                           className="btn btn-primary btn-sm"
                           onClick={this.props.onDone}/>
                </label>
            </div>
        );
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
            marginBottom: "15px",
        }
    }
}

export interface IUnavailableNoteModalProps {
    onDone: () => void;
}

export interface IUnavailableNoteModalState {

}