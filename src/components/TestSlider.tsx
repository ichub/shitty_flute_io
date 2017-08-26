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
    const { value, dragging, index, ...restProps } = props;
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

const wrapperStyle = { width: 400, margin: 50 };

@Radium
export class TestSlider extends React.Component<ITestSliderProps, ITestSliderState> {
    props: ITestSliderProps;
    state: ITestSliderState;

    constructor(props: ITestSliderProps) {
        super();
        console.log("constructing testslider");
        this.state = {value: [props.start / props.duration * 1000 -1,
            props.position / props.duration * 1000,
            props.end / props.duration * 1000 + 1]};
    }

    private thousandthsToTime(value: number) {
        return moment.duration(Math.round((value / 1000) * this.props.duration), "seconds").format("m:ss", {trim: false});
    }

     componentWillReceiveProps(nextProps: ITestSliderProps) {
        console.log("receiving props:");
        console.log(nextProps);

         this.setState({
             value: [nextProps.start / nextProps.duration * 1000 - 1,
                 nextProps.position / nextProps.duration * 1000,
                 nextProps.end / nextProps.duration * 1000 + 1],
         })
    }

    private onChange(value: number[]) {
        if (!this.props.locked) {
            this.props.onChange(value);
            this.setState({value: value});
        }
    }

    render() {
        console.log("rendering testslider");
        console.log(this.state.value);
        return (
            <div>
                <div style={wrapperStyle}>
                    <p></p>
                    <Range
                        min={-1}
                        max={1001}
                        count={2}
                        pushable={1}
                        onChange={this.onChange.bind(this)}
                        value={this.state.value}
                        tipFormatter={this.thousandthsToTime.bind(this)} />
                </div>
            </div>
        );
    }
}

export interface ITestSliderProps {
    duration: number; // duration of video, in seconds
    position: number; // current position in video
    start: number;
    end: number;
    onChange: (value: number[]) => void;
    locked: boolean;
}

export interface ITestSliderState {
    value: number[]
}