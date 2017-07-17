import * as React from "react";
import * as Radium from "radium";
import {INoteInfo} from "../models/INoteInfo";
import {ICompositionNote} from "../models/ICompositionNote";

@Radium
export class FluteAudioPlayer extends React.Component<IFluteAudioPlayerProps, IFluteAudioPlayerState> {
    props: IFluteAudioPlayerProps;
    state: IFluteAudioPlayerState;

    constructor(props: IFluteAudioPlayerProps) {
        super(props);

        console.log(props);
    }

    componentDidMount() {
        this.playPlayingSounds();
    }

    stopAllSounds() {
        for (let i = 0; i < this.props.notes.length; i++) {
            (this.refs[this.props.notes[i].name] as HTMLAudioElement).pause();
        }
    }

    playPlayingSounds() {
        for (let i = 0; i < this.props.playingNotes.length; i++) {
            (this.refs[this.props.playingNotes[i].noteInfo.name] as HTMLAudioElement).play();
        }
    }

    componentWillReceiveProps(props: IFluteAudioPlayerProps) {
        console.log("will");
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