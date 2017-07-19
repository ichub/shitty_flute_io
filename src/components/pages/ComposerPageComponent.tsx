import * as React from "react";
import * as Radium from "radium";
import {Composer} from "../Composer";
import {INoteInfo, makeINoteInfo} from "../../models/INoteInfo";
import {SongSelectorComponent} from "../SongSelectorComponent";
import {LoadingOverlayComponent} from "../LoadingOverlayComponent";

@Radium
export class ComposerPageComponent extends React.Component<IComposerPageComponentProps, IComposerPageComponentState> {
    public state: IComposerPageComponentState;

    constructor(props) {
        super();

        this.state = {
            notes: [
                makeINoteInfo("C", "/res/notes/C-Normal.mp3", "/res/notes/C-Shitty.mp3", "A"),
                makeINoteInfo("D", "/res/notes/D-Normal.mp3", "/res/notes/D-Shitty.mp3", "S"),
                makeINoteInfo("E", "/res/notes/E-Normal.mp3", "/res/notes/E-Shitty.mp3", "D"),
                makeINoteInfo("F", "/res/notes/F-Normal.mp3", "/res/notes/F-Shitty.mp3", "F"),
                makeINoteInfo("G", "/res/notes/G-Normal.mp3", "/res/notes/G-Shitty.mp3", "G"),
                makeINoteInfo("A", "/res/notes/A-Normal.mp3", "/res/notes/A-Shitty.mp3", "H"),
                makeINoteInfo("B", "/res/notes/B-Normal.mp3", "/res/notes/B-Shitty.mp3", "J"),
            ],
            videoPlayer: null,
            totalAsyncComponents: 2,
            asyncComponentsLoaded: 0,
        };
    }

    public render() {
        return (
            <div>
                <div style={[
                    ComposerPageComponent.styles.base,
                ]}>
                    <Composer
                        onReady={this.onComposerReady.bind(this)}
                        compositionId={this.props.compositionId}
                        notes={this.state.notes}
                        playVideo={this.playVideo.bind(this)}
                        pauseVideo={this.pauseVideo.bind(this)}
                        getVideoTime={this.getVideoTime.bind(this)}
                        setVideoTime={this.setVideoTime.bind(this)}/>
                </div>
                <div>
                    <SongSelectorComponent onVideoReady={this.onVideoReady.bind(this)}/>
                </div>

                <LoadingOverlayComponent visible={!this.isReady()}/>
            </div>
        );
    }

    private static styles = {
        base: {},
    };

    isReady() {
        return this.state.asyncComponentsLoaded >= this.state.totalAsyncComponents;
    }

    incrementReadyState() {
        this.setState({
            asyncComponentsLoaded: this.state.asyncComponentsLoaded + 1,
        });
    }

    private onComposerReady() {
        this.incrementReadyState();
    }

    public playVideo() {
        this.state.videoPlayer.playVideo();
    }

    public pauseVideo() {
        this.state.videoPlayer.pauseVideo();
    }

    public getVideoTime() {
        return this.state.videoPlayer.getCurrentTime();
    }

    public setVideoTime(time: number) {
        console.log(time);
        this.state.videoPlayer.seekTo(time, true);
    }

    public onVideoReady(event) {
        // access to player in all event handlers via event.target
        this.setState({
            videoPlayer: event.target,
        });

        this.incrementReadyState();

        event.target.pauseVideo();
    }
}

export interface IComposerPageComponentState {
    notes: INoteInfo[];
    videoPlayer: any;
    totalAsyncComponents: number;
    asyncComponentsLoaded: number;
}

export interface IComposerPageComponentProps {
    compositionId: string;
}