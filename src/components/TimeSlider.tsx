import * as React from "react";
import * as Radium from "radium";
import Slider from "rc-slider";
import Range from "rc-slider";
import {AccentColor} from "../styles/GlobalStyles";
var moment = require("moment");
require("moment-duration-format");
const Tooltip = require("rc-tooltip");


const createSliderWithTooltip = (Slider as any).createSliderWithTooltip;
const Range = createSliderWithTooltip((Slider as any).Range);
const Handle = (Slider as any).Handle;

const handle = (props) => {
    const {value, dragging, index, ...restProps} = props;
    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={dragging}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

@Radium
export class TimeSlider extends React.Component<ITimeSliderProps, ITimeSliderState> {
    props: ITimeSliderProps;
    state: ITimeSliderState;

    constructor(props: ITimeSliderProps) {
        super();
        this.state = {
            value: [props.start / props.duration * 1000 - 1,
                props.position / props.duration * 1000,
                props.end / props.duration * 1000 + 1]
        };
    }

    private thousandthsToTime(value: number) {
        return moment.duration(Math.round((value / 1000) * this.props.duration), "seconds").format("m:ss", {trim: false});
    }

    private secondsToTime(value: number) {
        return moment.duration(value, "seconds").format("m:ss", {trim: false});
    }

    componentWillReceiveProps(nextProps: ITimeSliderProps) {
        this.setState({
            value: [nextProps.start / nextProps.duration * 1000 - 1,
                nextProps.position / nextProps.duration * 1000,
                nextProps.end / nextProps.duration * 1000 + 1]
        });
    }

    private onChange(value: number[]) {
        if (!this.props.locked) {
            this.props.onChange(value);
            this.setState({value: value});
        }
    }

    render() {
        return (
            <div style={[TimeSlider.styles.base]}>
                <div style={[TimeSlider.styles.time, TimeSlider.styles.flex]}>
                    {this.secondsToTime(this.props.position)}
                </div>
                <div style={[TimeSlider.styles.sliderContainer, TimeSlider.styles.flex]}>
                    <Range
                        min={-1}
                        max={1001}
                        count={2}
                        pushable={1}
                        onChange={this.onChange.bind(this)}
                        value={this.state.value}
                        tipFormatter={this.thousandthsToTime.bind(this)}/>
                </div>
            </div>
        );
    }

    private static readonly styles = {
        base: {
            height: "100%",
        },
        flex: {
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
        },
        time: {
            display: "inline-block",
            width: "40px",
            height: "100%",
            marginRight: "20px",
            fontWeight: "bolder",
            color: AccentColor
        },
        sliderContainer: {
            display: "inline-block",
            height: "100%",
            width: "400px"
        }
    }
}

export interface ITimeSliderProps {
    duration: number; // duration of video, in seconds
    position: number; // current position in video
    start: number;
    end: number;
    onChange: (value: number[]) => void;
    locked: boolean;
    buffering: boolean;
}

export interface ITimeSliderState {
    value: number[]
}