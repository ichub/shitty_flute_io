import * as React from "react";
import * as Radium from "radium";
import {Composer} from "../Composer";
import {INoteInfo} from "../../models/INoteInfo";
import {INoteInfo, makeINoteInfo} from "../../models/INoteInfo";
import {VideoPlayer} from "../VideoPlayer";
import {LoadingOverlayComponent} from "../LoadingOverlayComponent";
import {NoteInfoList} from "../../models/NoteInfoList";

@Radium
export class ComposerPageComponent extends React.Component<IComposerPageComponentProps, IComposerPageComponentState> {
    public state: IComposerPageComponentState;

    constructor(props) {
        super();

        this.state = {
            notes: NoteInfoList.notes,
            videoPlayer: null,
            totalAsyncComponents: 2,
            asyncComponentsLoaded: 0,
            videoTitle: "",
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
                        editToken={this.props.editToken}
                        notes={this.state.notes}
                        setVideoTitle={this.setVideoTitle.bind(this)}
                        playVideo={this.playVideo.bind(this)}
                        pauseVideo={this.pauseVideo.bind(this)}
                        getVideoTime={this.getVideoTime.bind(this)}
                        setVideoTime={this.setVideoTime.bind(this)}/>
                </div>
                <div>
                    <VideoPlayer
                        onVideoReady={this.onVideoReady.bind(this)}
                        videoTitle={this.state.videoTitle}/>
                </div>

                <LoadingOverlayComponent visible={!this.isReady()}/>
            </div>
        );
    }

    private static styles = {
        base: {},
    };

    setVideoTitle(title: string) {
        this.setState({
            videoTitle: title,
        });
    }

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
    videoTitle: string;
}

export interface IComposerPageComponentProps {
    editToken: string;
}