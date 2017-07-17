import * as React from "react";
import * as Radium from "radium";
import {INoteInfo} from "../models/INoteInfo";
import {ICompositionNote} from "../models/ICompositionNote";

@Radium
export class FluteAudioPlayer extends React.Component<IFluteAudioPlayerProps, IFluteAudioPlayerState> {
    props: IFluteAudioPlayerProps;
    state: IFluteAudioPlayerState;

    refs: {
        silence: HTMLAudioElement;
    };

    constructor(props: IFluteAudioPlayerProps) {
        super(props);

        console.log(props);
    }

    componentDidMount() {
        this.playPlayingSounds();
        this.refs.silence.play();
    }

    iterateOverNotes(consumer: (audio: HTMLAudioElement, note: INoteInfo) => void) {
        for (let i = 0; i < this.props.notes.length; i++) {
            const note = this.props.notes[i];
            const element = this.refs[note.name] as HTMLAudioElement;

            consumer(element, note);
        }
    }

    stopAllSounds() {
        this.iterateOverNotes((audio, note) => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    playPlayingSounds() {
        this.iterateOverNotes((audio, note) => {
            if (this.props.playingNotes.filter(playing => note.name === playing.noteInfo.name)[0]) {
                audio.play();
            }
        });
    }

    componentWillReceiveProps(props: IFluteAudioPlayerProps) {
        this.stopAllSounds();
        this.playPlayingSounds();
    }

    render() {
        return (
            <div style={[
                FluteAudioPlayer.styles.base,
            ]}>
                {
                    this.props.notes.map((note, i) => {
                        return (
                            <div key={i}>
                                <audio ref={note.name}>
                                    <source src={note.soundFileUrl}/>
                                </audio>
                            </div>
                        );
                    })
                }
                <audio ref="silence" loop={true}>
                    <source src="/res/5-minutes-of-silence.mp3"/>
                </audio>
            </div>
        );
    }

    private static styles = {
        base: {
            display: "none",
        },
    };
}

export interface IFluteAudioPlayerProps {
    playingNotes: ICompositionNote[]
    notes: INoteInfo[];
}

export interface IFluteAudioPlayerState {

}