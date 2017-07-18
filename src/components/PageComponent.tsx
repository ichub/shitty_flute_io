import * as React from "react";
import * as Radium from "radium";
import {Composer} from "./Composer";
import {INoteInfo, makeINoteInfo} from "../models/INoteInfo";
import {SongSelectorComponent} from "./SongSelectorComponent";

@Radium
export class PageComponent extends React.Component<IPageComponentProps, IPageComponentState> {
    public state: IPageComponentState;

    constructor(props) {
        super(props);

        this.state = {
            notes: [
                makeINoteInfo("C", "/res/notes/C-Normal.mp3", "/res/notes/C-Shitty.mp3", "A"),
                makeINoteInfo("D", "/res/notes/D-Normal.mp3", "/res/notes/D-Shitty.mp3", "S"),
                makeINoteInfo("E", "/res/notes/E-Normal.mp3", "/res/notes/E-Shitty.mp3", "D"),
                makeINoteInfo("F", "/res/notes/F-Normal.mp3", "/res/notes/F-Shitty.mp3", "F"),
                makeINoteInfo("G", "/res/notes/G-Normal.mp3", "/res/notes/G-Shitty.mp3", "G"),
                makeINoteInfo("A", "/res/notes/A-Normal.mp3", "/res/notes/A-Shitty.mp3", "H"),
                makeINoteInfo("B", "/res/notes/B-Normal.mp3", "/res/notes/B-Shitty.mp3", "J")
            ],
            videoPlayer: null,
        };
    }

    public render() {
        return (
            <div>
                <div style={[
                    PageComponent.styles.base
                ]}>
                    <Composer compositionId={this.props.compositionId} notes={this.state.notes} playVideo={this.playVideo.bind(this)}/>
                </div>
                <div>
                    <SongSelectorComponent onVideoReady={this._onReady.bind(this)}/>
                </div>
            </div>
        );
    }

    private static styles = {
        base: {}
    };

    public playVideo() {
        this.state.videoPlayer.playVideo();
    }

    public _onReady(event) {
        // access to player in all event handlers via event.target
        this.setState({
            videoPlayer: event.target
        })
        event.target.pauseVideo();
    }
}

export interface IPageComponentState {
    notes: INoteInfo[];
    videoPlayer: any;
}

export interface IPageComponentProps {
    compositionId: string;
}