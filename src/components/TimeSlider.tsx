import * as React from "react";
import * as Radium from "radium";
import ReactDOM from "react-dom";
import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import Range from "rc-slider";

var moment = require("moment");
require("moment-duration-format");

const createSliderWithTooltip = (Slider as any).createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

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
    }

    private thousandthsToTime(value: number) {
        return moment.duration(Math.round((value / 1000) * this.props.duration), "seconds").format("m:ss", {trim: false});
    }

    render() {
        return (
            <div>
                <p>Time</p>
                <Range
                    min={-1}
                    max={1001}
                    count={2}
                    value={[-1, this.props.position / this.props.duration * 1000, 1001]}
                    pushable={1}
                    allowCross={false}
                    tipFormatter={this.thousandthsToTime.bind(this)}/>
            </div>
        );
    }
}

export interface ITimeSliderProps {
    duration: number; // duration of video, in seconds
    position: number; // current position in video
}

export interface ITimeSliderState {

}