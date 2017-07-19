import * as React from "react";
import * as Radium from "radium";
import {RecorderNote} from "../RecorderNote";
import {AudioOutputHelper} from "../../AudioOutputHelper";
import {NoteInfoList} from "../../models/NoteInfoList";
import {SingleNotePlayer} from "../../SingleNotePlayer";
import {ITotalNoteState, NoteKeyboardManager} from "../../NoteKeyboardManager";
import {INoteInfo} from "../../models/INoteInfo";

@Radium
export class RecorderPlayerPageComponent extends React.Component<IRecorderPlayerPageComponentProps, IRecorderPlayerPageComponentState> {
    props: IRecorderPlayerPageComponentProps;
    state: IRecorderPlayerPageComponentState;

    audioOutputHelper: Promise<AudioOutputHelper>;
    singleNotePlayer: SingleNotePlayer;
    noteKeyboardManager: NoteKeyboardManager;

    constructor(props: IRecorderPlayerPageComponentProps) {
        super();

        this.state = {
            noteState: {
                down: [],
                played: [],
            },
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

    isNoteDown(note: INoteInfo): boolean {
        return this.state.noteState.down.filter(down => down.note.name === note.name).length === 1;
    }

    render() {
        return (
            <div style={[
                RecorderPlayerPageComponent.styles.base,
            ]}>
                {
                    NoteInfoList.notes.map((note, i) => {
                        return <RecorderNote key={i} note={note} isDown={this.isNoteDown(note)}/>;
                    })
                }
            </div>
        );
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
    noteState: ITotalNoteState;
}