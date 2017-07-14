import * as React from "react";
import * as Radium from "radium";
import {INoteInfo} from "../models/INoteInfo";

@Radium
export class FluteAudioPlayer extends React.Component<IFluteAudioPlayerProps, IFluteAudioPlayerState> {
    props: IFluteAudioPlayerProps;
    state: IFluteAudioPlayerState;

    constructor(props: IFluteAudioPlayerProps) {
        super(props);
    }

    componentDidMount() {
        this.playPlayingSounds();
    }

    stopAllSounds() {
        for (let i = 0; i < this.props.notes.length; i++) {
            (this.refs[i + ""] as HTMLAudioElement).pause();
        }
    }

    playPlayingSounds() {
        for (let i = 0; i < this.props.playingIndices.length; i++) {
            (this.refs[this.props.playingIndices[i + ""]] as HTMLAudioElement).play();
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
                                <audio ref={i + ""}>
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
    playingIndices: number[]
    notes: INoteInfo[];
}

export interface IFluteAudioPlayerState {

}