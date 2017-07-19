import * as React from "react";
import * as Radium from "radium";
import {RecorderNote} from "../RecorderNote";
import {IYoutubeVideoPlayer, VideoPlayer} from "../VideoPlayer";
import {AudioOutputHelper} from "../../AudioOutputHelper";
import {NoteInfoList} from "../../models/NoteInfoList";
import {SingleNotePlayer} from "../../SingleNotePlayer";
import {ICompletedNote, ITotalNoteState, NoteKeyboardManager} from "../../NoteKeyboardManager";
import {INoteInfo} from "../../models/INoteInfo";

@Radium
export class RecorderPlayerPageComponent extends React.Component<IRecorderPlayerPageComponentProps, IRecorderPlayerPageComponentState> {
    props: IRecorderPlayerPageComponentProps;
    state: IRecorderPlayerPageComponentState;

    audioOutputHelper: Promise<AudioOutputHelper>;
    singleNotePlayer: SingleNotePlayer;
    noteKeyboardManager: NoteKeyboardManager;
    video: IYoutubeVideoPlayer;

    stopPlayingTimeout: NodeJS.Timer;

    constructor(props: IRecorderPlayerPageComponentProps) {
        super();

        this.state = {
            noteState: {
                down: [],
                played: [],
            },
            youtubeVideoId: "HQnC1UHBvWA",
            stateName: RecorderStateName.FreePlay,
            recordingYoutubeStartTime: 0,
            recordingYoutubeEndTime: 0,
            hasRecorded: false,
            recording: [],
            startRecordingDateTime: 0,
        };

        this.audioOutputHelper = AudioOutputHelper.getInstance(NoteInfoList.notes);
        this.singleNotePlayer = new SingleNotePlayer();
        this.noteKeyboardManager = new NoteKeyboardManager(NoteInfoList.notes);

        this.noteKeyboardManager.attachListeners();

        this.noteKeyboardManager.on(NoteKeyboardManager.NOTE_START, (note: INoteInfo) => {
            this.audioOutputHelper.then(helper => {
                this.singleNotePlayer.playNote(helper, note);
            });
        });

        this.noteKeyboardManager.on(NoteKeyboardManager.NOTE_END, (note: INoteInfo) => {
            this.audioOutputHelper.then(helper => {
                this.singleNotePlayer.stopNote(helper, note);
            });
        });

        this.noteKeyboardManager.on(NoteKeyboardManager.STATE_CHANGED, (state: ITotalNoteState) => {
            this.setState({
                noteState: state,
            });
        });
    }

    private isNoteDown(note: INoteInfo): boolean {
        return this.state.noteState.down.filter(down => down.note.name === note.name).length === 1;
    }

    private onVideoReady(event) {
        console.log("video ready");

        this.video = event.target as IYoutubeVideoPlayer;
        this.video.pauseVideo();
    }

    render() {
        return (
            <div style={[
                RecorderPlayerPageComponent.styles.base,
            ]}>
                <div>
                    <div>
                        state: {this.state.stateName} <br/>
                        record start: {this.state.recordingYoutubeStartTime} <br/>
                        record end: {this.state.recordingYoutubeEndTime} <br/>
                        has recorded: {this.state.hasRecorded.toString()} <br/>
                        notes recorded: {this.state.recording.length} <br/>
                        start offset: {this.state.startRecordingDateTime} <br/>
                    </div>

                    <br/>

                    <input
                        type="button"
                        value="record"
                        onClick={this.record.bind(this)}
                        disabled={this.state.stateName !== RecorderStateName.FreePlay}/>
                    <input
                        type="button"
                        value="stop recording"
                        onClick={this.stopRecording.bind(this)}
                        disabled={this.state.stateName !== RecorderStateName.Recording}/>
                    <input
                        type="button"
                        value="play back"
                        onClick={this.play.bind(this)}
                        disabled={this.state.stateName !== RecorderStateName.FreePlay || !this.state.hasRecorded}/>
                    <input
                        type="button"
                        value="stop play back"
                        onClick={this.stopPlayback.bind(this)}
                        disabled={this.state.stateName !== RecorderStateName.Playing}/>
                    <input
                        type="button"
                        value="reset"
                        onClick={this.reset.bind(this)}
                        disabled={this.state.stateName !== RecorderStateName.FreePlay}/>
                </div>

                <br/>
                <div>
                    {
                        NoteInfoList.notes.map((note, i) => {
                            return <RecorderNote key={i} note={note} isDown={this.isNoteDown(note)}/>;
                        })
                    }
                </div>
                <div>
                    <VideoPlayer
                        videoId={this.state.youtubeVideoId}
                        onVideoReady={this.onVideoReady.bind(this)}
                        canInteract={this.state.stateName == RecorderStateName.FreePlay}
                    />
                </div>
            </div>
        );
    }

    private reset() {
        if (this.state.stateName === RecorderStateName.FreePlay) {
            this.noteKeyboardManager.clearPlayedNotes();
            this.setState({
                recordingYoutubeStartTime: 0,
                recordingYoutubeEndTime: 0,
                stateName: RecorderStateName.FreePlay,
                hasRecorded: false,
                recording: [],
                startRecordingDateTime: 0,
            });
        }
    }

    private record() {
        if (this.state.stateName === RecorderStateName.FreePlay) {
            this.reset();
            this.setState({
                stateName: RecorderStateName.Recording,
                recordingYoutubeStartTime: this.video.getCurrentTime(),
                startRecordingDateTime: new Date().getTime()
            });
            this.video.playVideo();
        }
    }

    private stopRecording() {
        if (this.state.stateName === RecorderStateName.Recording) {
            this.setState({
                stateName: RecorderStateName.FreePlay,
                recordingYoutubeEndTime: this.video.getCurrentTime(),
                hasRecorded: true,
                recording: this.state.noteState.played.slice()
            });
            this.video.pauseVideo();
            this.video.seekTo(this.state.recordingYoutubeStartTime);
        }
    }

    private play() {
        if (this.state.stateName === RecorderStateName.FreePlay && this.state.hasRecorded) {
            this.setState({
                stateName: RecorderStateName.Playing
            });

            this.stopPlayingTimeout = setTimeout(() => {
                this.stopPlayingTimeout = null;
                this.stopPlayback();
            }, (this.state.recordingYoutubeEndTime - this.state.recordingYoutubeStartTime) * 1000);

            this.video.seekTo(this.state.recordingYoutubeStartTime);
            this.video.playVideo();

            this.audioOutputHelper.then(helper => {
                helper.playListOfNotes(this.state.startRecordingDateTime, this.state.recording);
            });
        }
    }

    private stopPlayback() {
        if (this.state.stateName === RecorderStateName.Playing) {
            this.setState({
                stateName: RecorderStateName.FreePlay,
            });

            this.video.seekTo(this.state.recordingYoutubeStartTime);
            this.video.pauseVideo();

            if (this.stopPlayingTimeout) {
                clearTimeout(this.stopPlayingTimeout);
            }
        }
    }

    private static styles = {
        base: {
            width: "100%",
        },
    };
}

export interface IRecorderPlayerPageComponentProps {

}

export interface IRecorderPlayerPageComponentState {
    stateName: RecorderStateName;
    youtubeVideoId: string;
    noteState: ITotalNoteState;
    recordingYoutubeStartTime: number;
    recordingYoutubeEndTime: number;
    startRecordingDateTime: number;
    hasRecorded: boolean;
    recording: ICompletedNote[];
}

export enum RecorderStateName {
    FreePlay = "free_play",
    Recording = "recording",
    Playing = "playing"
}