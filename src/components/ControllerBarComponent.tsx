import * as React from "react";
import * as Radium from "radium";
import {RecorderStateName} from "./pages/RecorderPlayerPageComponent";
import * as ReactTooltip from "react-tooltip";
import Slider from "rc-slider";
import {VideoInfo} from "./VideoIconComponent";
import {YoutubeVideoChangeComponent} from "./YoutubeVideoChangeComponent";

@Radium
export class ControllerBarComponent extends React.Component<IControllerBarComponentProps, IControllerBarComponentState> {
    props: IControllerBarComponentProps;
    state: IControllerBarComponentState;

    refs: {
        youtubeVolume: HTMLInputElement
    };

    constructor(props: IControllerBarComponentProps) {
        super();
    }

    onSliderValueChange() {
        this.props.onVolumeChange(parseInt((this.refs.youtubeVolume as any).state.value));
    }

    render() {
        let playDisabled: boolean = this.props.stateName !== RecorderStateName.Playing;
        let stopPlayDisabled: boolean = this.props.stateName !== RecorderStateName.FreePlay || !this.props.hasRecorded;

        const stopOrPlayButton = this.props.stateName === RecorderStateName.Playing ? (
            <button
                key="3"
                type="button"
                value="stop play back"
                onClick={this.props.stopPlayback}
                disabled={playDisabled}>
                <i className="fa fa-stop" aria-hidden="true"></i>
            </button>
        ) : (
            <button
                key="2"
                type="button"
                value="play back"
                onClick={this.props.play}
                disabled={stopPlayDisabled}>
                <i className="fa fa-play" aria-hidden="true"></i>
            </button>
        );

        let recordDisabled: boolean = this.props.viewOnly || this.props.stateName !== RecorderStateName.Recording;
        let stopRecordDisabled: boolean = this.props.viewOnly || this.props.stateName !== RecorderStateName.FreePlay;

        const recordOrStopRecordingButton = this.props.stateName === RecorderStateName.Recording ? (
            <button
                key="1"
                type="button"
                value="stop recording"
                onClick={this.props.stopRecording}
                disabled={recordDisabled}>
                <i className="fa fa-stop" aria-hidden="true"></i>
            </button>
        ) : (
            <button
                key="0"
                type="button"
                value="record"
                onClick={this.props.record}
                disabled={stopRecordDisabled}>
                <i className="fa fa-circle" aria-hidden="true"></i>
            </button>
        );

        return (
            <div style={[
                ControllerBarComponent.styles.base
            ]}>
                <div style={[
                    ControllerBarComponent.styles.volume
                ]}>
                    <Slider
                        ref="youtubeVolume"
                        min={0}
                        max={100}
                        defaultValue={this.props.initialVolume}
                        onBeforeChange={this.onSliderValueChange.bind(this)}
                        onChange={this.onSliderValueChange.bind(this)}/>
                </div>

                <span
                    data-tip="record/stop recording"
                    data-for="record">
                                {recordOrStopRecordingButton}
                            </span>
                <span
                    data-tip="playback/stop playback"
                    data-for="playback">
                                {stopOrPlayButton}
                            </span>
                <ReactTooltip id="record" place="top" type="dark" effect="solid" delayHide={1}/>
                <ReactTooltip id="playback" place="top" type="dark" effect="solid" delayHide={1}/>

                <span
                    data-tip="reset"
                    data-for="reset">
                            <button
                                key="4"
                                type="button"
                                value="reset"
                                onClick={this.props.reset}
                                disabled={!this.props.hasRecorded || this.props.viewOnly || this.props.stateName !== RecorderStateName.FreePlay}>
                                <i className="fa fa-eraser" aria-hidden="true"></i>
                            </button>
                        </span>
                <ReactTooltip id="reset" place="top" type="dark" effect="solid" delayHide={1}/>

                <span
                    data-tip="save"
                    data-for="save">
                            <button
                                key="5"
                                type="button"
                                value="save"
                                onClick={this.props.save}
                                disabled={!this.props.hasRecorded || this.props.viewOnly || this.props.stateName !== RecorderStateName.FreePlay}>
                                <i className="fa fa-floppy-o" aria-hidden="true"></i>
                            </button>
                        </span>
                <ReactTooltip id="save" place="top" type="dark" effect="solid" delayHide={1}/>
                <VideoInfo youtubeVideoId={this.props.youtubeVideoId}/>
                <YoutubeVideoChangeComponent isEnabled={this.props.stateName == RecorderStateName.FreePlay}
                                             onVideoIdChange={this.props.onVideoIdChange}/>
            </div>
        );
    }

    private static styles = {
        base: {
            width: "100%",
            height: "60px",
            position: "fixed",
            bottom: "0",
            left: "0",
            backgroundColor: "rgb(240, 240, 240)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        volume: {
            width: "100px",
            height: "20px",
            margin: "20px",
        }
    }
}

export interface IControllerBarComponentProps {
    hasRecorded: boolean;
    save: () => void;
    reset: () => void;
    record: () => void;
    play: () => void;
    stopPlayback: () => void;
    stopRecording: () => void;
    onVolumeChange: (value: number) => void;
    onVideoIdChange: (value: string) => void;
    initialVolume: number;
    viewOnly: boolean;
    stateName: RecorderStateName;
    youtubeVideoId: string;
}

export interface IControllerBarComponentState {

}