import * as React from "react";
import * as Radium from "radium";
import {RecorderStateName} from "./pages/RecorderPlayerPageComponent";
import * as ReactTooltip from "react-tooltip";
import Slider from "rc-slider";
import {YoutubeVideoChangeComponent} from "./YoutubeVideoChangeComponent";
import {OpenSansFont, ModalStyle} from "../styles/GlobalStyles";
import {TimeSlider} from "./TimeSlider";
import {VideoInfo} from "./VideoInfoComponent";
import * as ReactModal from "react-modal";

@Radium
export class ControllerBarComponent extends React.Component<IControllerBarComponentProps, IControllerBarComponentState> {
    props: IControllerBarComponentProps;
    state: IControllerBarComponentState;

    refs: {
        youtubeVolume: HTMLInputElement
    };

    constructor(props: IControllerBarComponentProps) {
        super();

        this.state = {
            isEditYoutubeLinkOpen: false,
        }
    }

    onSliderValueChange() {
        this.props.onVolumeChange(parseInt((this.refs.youtubeVolume as any).state.value));
    }

    render() {
        let playDisabled: boolean = this.props.stateName !== RecorderStateName.Playing;
        let stopPlayDisabled: boolean = this.props.stateName !== RecorderStateName.FreePlay;

        const stopOrPlayButton = this.props.stateName === RecorderStateName.Playing ? (
                <button
                    style={[ControllerBarComponent.styles.controllerButton]}
                    key="3"
                    type="button"
                    value="stop play back"
                    onClick={this.props.stopPlayback}
                    disabled={playDisabled}>
                    <i className="fa fa-pause" aria-hidden="true"></i>
                </button>
            ) : (
                <button
                    style={[ControllerBarComponent.styles.controllerButton]}
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
                    style={[ControllerBarComponent.styles.controllerButton]}
                    key="1"
                    type="button"
                    value="stop recording"
                    onClick={this.props.stopRecording}
                    disabled={recordDisabled}>
                    <i className="fa fa-stop" aria-hidden="true"></i>
                </button>
            ) : (
                <button
                    style={[ControllerBarComponent.styles.controllerButton]}
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
                ControllerBarComponent.styles.base,
                OpenSansFont
            ]}>
                <i className="fa fa-volume-up" aria-hidden="true"></i>

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
                <ReactTooltip id="record" place="top" effect="solid" delayHide={1}/>
                <ReactTooltip id="playback" place="top" effect="solid" delayHide={1}/>

                <span
                    data-tip="reset"
                    data-for="reset">
                    <button
                        style={[ControllerBarComponent.styles.controllerButton]}
                        key="4"
                        type="button"
                        value="reset"
                        onClick={this.props.reset}
                        disabled={!this.props.hasRecorded || this.props.viewOnly || this.props.stateName !== RecorderStateName.FreePlay}>
                        <i className="fa fa-eraser" aria-hidden="true"></i>
                    </button>
                </span>
                <ReactTooltip id="reset" place="top" effect="solid" delayHide={1}/>

                <span
                    data-tip="save"
                    data-for="save">
                    <button
                        style={[ControllerBarComponent.styles.controllerButton]}
                        key="5"
                        type="button"
                        value="save"
                        onClick={this.props.save}
                        disabled={!this.props.hasRecorded || this.props.viewOnly || this.props.stateName !== RecorderStateName.FreePlay}>
                        <i className="fa fa-floppy-o" aria-hidden="true"></i>
                    </button>
                </span>
                <ReactTooltip id="save" place="top" effect="solid" delayHide={1}/>
                <ReactModal
                    style={ModalStyle}
                    isOpen={this.state.isEditYoutubeLinkOpen}
                    contentLabel="Upcoming Feature"
                    onRequestClose={this.onChangeModalCancel.bind(this)}>
                    <YoutubeVideoChangeComponent isEnabled={this.props.stateName == RecorderStateName.FreePlay}
                                                 onVideoIdChange={this.onVideoChange.bind(this)}/>
                </ReactModal>
                <span>
                    <TimeSlider
                        duration={this.props.videoDuration}
                        position={Math.max(this.props.videoPosition, this.props.startTime)}
                        start={this.props.startTime}
                        end={this.props.endTime}
                        locked={this.props.stateName !== RecorderStateName.FreePlay}
                        onChange={this.props.onTimeSliderChange}
                        buffering={this.props.videoBuffering}/>
                </span>
                <span
                    data-tip="change video"
                    data-for="change video">
                    <VideoInfo
                        openModal={this.openModal.bind(this)}
                        youtubeVideoId={this.props.youtubeVideoId}/>
                    <ReactTooltip id="change video" place="top" effect="solid" delayHide={1} disable={this.props.viewOnly}/>
                </span>
            </div>
        );
    }

    onVideoChange(id: string) {
        this.setState({
            isEditYoutubeLinkOpen: false
        });

        this.props.onVideoIdChange(id);
    }

    onChangeModalCancel() {
        this.setState({
            isEditYoutubeLinkOpen: false
        });
    }

    openModal() {
        if (!this.props.viewOnly) {
            if (this.props.stateName == RecorderStateName.FreePlay) {
                this.setState({
                    isEditYoutubeLinkOpen: true
                });
            }
        }
    }

    private handleCloseModal() {
        this.setState({
            isEditYoutubeLinkOpen: false
        })
    }

    public static readonly HEIGHT = "60px";

    private static styles = {
        base: {
            width: "100%",
            height: ControllerBarComponent.HEIGHT,
            position: "fixed",
            bottom: "0",
            left: "0",
            backgroundColor: "rgb(240, 240, 240)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: "20px",
            paddingRight: "20px",
            borderTop: "1px solid rgb(200, 200, 200)"
        },
        volume: {
            width: "100px",
            height: "30px",
            marginLeft: "30px",
            marginBottom: "30px",
            marginRight: "30px",
            marginTop: "40px",
        },
        controllerButton: {
            backgroundColor: "transparent",
            border: "transparent",
            fontSize: "1em",
            margin: "5px"
        },
    };
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
    videoDuration: number;
    videoPosition: number;
    startTime: number;
    endTime: number;
    onTimeSliderChange: (value: number[]) => void;
    videoBuffering: boolean;
}

export interface IControllerBarComponentState {
    isEditYoutubeLinkOpen: boolean;
}