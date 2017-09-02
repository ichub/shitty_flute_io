import * as React from "react";
import * as Radium from "radium";
import {ICompositionState} from "../../models/ICompositionState";

const getYoutubeId = require("get-youtube-id");
const axios = require("axios");

@Radium
export class AutoComposePageComponent extends React.Component<IAutoComposePageComponentProps, IAutoComposePageComponentState> {
    props: IAutoComposePageComponentProps;
    state: IAutoComposePageComponentState;

    refs: {
        youtubeLink: HTMLInputElement
    };

    constructor(props: IAutoComposePageComponentProps) {
        super();

        this.state = {
            stateName: AutoComposeStateName.Loading,
            composition: null,
            flootified: false,
            youtubeVideoId: ""
        };
    }

    componentDidMount() {
        this.load();
    }

    load() {
        console.log("loading");

        axios.get(`/recorder/${this.props.editToken}/data`)
            .then((result) => {
                console.log("here's the result i got back:");
                console.log(result);
                let compositionState = result.data as ICompositionState;
                console.log("load complete");

                this.setState({
                    composition: compositionState,
                    stateName: AutoComposeStateName.Idle,
                    flootified: true,
                    youtubeVideoId: compositionState.youtubeVideoId
                });
            })
    }

    render() {
        return (
            <div style={[
                AutoComposePageComponent.styles.base
            ]}>
                <label>
                    youtube url:
                    <input ref="youtubeLink" type="text" value={`https://www.youtube.com/watch?v=${this.state.youtubeVideoId}`}/>
                </label>
                <input
                    type="submit"
                    onClick={this.onSubmitClick.bind(this)}
                    disabled={this.state.stateName !== AutoComposeStateName.Idle}/>
                <br/>
                <br/>
                state name: {this.state.stateName}
                <br/>
                flootified: {this.state.flootified.toString()}
            </div>
        );
    }

    onSubmitClick() {
        if (this.state.stateName !== AutoComposeStateName.Idle) {
            return;
        }

        let videoId = getYoutubeId(this.refs.youtubeLink.value);

        console.log(`new youtube url: ${videoId}`);

        if (videoId !== null) {
            this.flootify(videoId);
        } else {
            console.log("youtube link was invalid");
        }
    }

    flootify(videoId: string) {
        this.setState({
            stateName: AutoComposeStateName.Flootifying,
            youtubeVideoId: videoId,
        });

        axios.get(`/flootify/${videoId}`)
            .then((result) => {
                console.log("flootify complete");
                const comp = result.data as ICompositionState;

                this.setState({
                    stateName: AutoComposeStateName.Idle,
                    composition: comp,
                    flootified: true,
                    youtubeVideoId: comp.youtubeVideoId
                }, () => {
                    this.save();
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    save() {
        this.setState({
            stateName: AutoComposeStateName.Saving
        }, () => {
            axios.post(`/recorder/${this.props.editToken}/save`, this.state.composition)
                .then((result) => {
                    console.log("save complete");
                    this.setState({
                        stateName: AutoComposeStateName.Idle,
                        flootified: true,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    }

    private static styles = {
        base: {
            width: "100%"
        }
    }
}

enum AutoComposeStateName {
    Loading = "loading",
    Saving = "saving",
    Idle = "idle",
    Flootifying = "flootifying",
}

export interface IAutoComposePageComponentProps {
    isProd: boolean;
    editToken: string;
    viewToken: string;
}

export interface IAutoComposePageComponentState {
    youtubeVideoId: string;
    stateName: AutoComposeStateName;
    composition: ICompositionState;
    flootified: boolean;
}