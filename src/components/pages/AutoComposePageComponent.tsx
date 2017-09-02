import * as React from "react";
import * as Radium from "radium";

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
            stateName: AutoComposeStateName.Idle,
        }
    }

    render() {
        return (
            <div style={[
                AutoComposePageComponent.styles.base
            ]}>
                <label>
                    youtube url:
                    <input ref="youtubeLink" type="text"/>
                </label>
                <input type="submit" onClick={this.onSubmitClick.bind(this)}/>
                <br/>
                <br/>
                state name: {this.state.stateName}
            </div>
        );
    }

    onSubmitClick() {
        let videoId = getYoutubeId(this.refs.youtubeLink.value);

        console.log(`new youtube url: ${videoId}`);

        if (videoId !== null) {
            this.flootify(videoId);
        } else {

        }
    }

    flootify(videoId: string) {
        this.setState({
            stateName: AutoComposeStateName.Flootifying,
        });

        axios.get(`/flootify/${videoId}`)
            .then((result) => {
                console.log("flootify complete");
                this.setState({
                    stateName: AutoComposeStateName.Flootified
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    err: err as any
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
    Idle = "idle",
    Flootifying = "flootifying",
    Flootified = "flootified",
}

export interface IAutoComposePageComponentProps {
    isProd: boolean;
    editToken: string;
    viewToken: string;
}

export interface IAutoComposePageComponentState {
    stateName: AutoComposeStateName;
}