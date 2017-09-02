import {INoteInfo} from "./models/INoteInfo";
import {EventEmitter} from "events";
import {ICompositionNote} from "./models/ICompositionNote";
import {
    getINoteInfoForPositionIndex, getUIPositionForNote, getUIPositionWithCharacter,
    NoteUIPositionList
} from "./models/NoteUIPositionList";
import {RecorderPlayerPageComponent} from "./components/pages/RecorderPlayerPageComponent";

export class NoteKeyboardManager extends EventEmitter {
    public static readonly NOTE_START = "note_start";
    public static readonly NOTE_END = "note_end";
    public static readonly STATE_CHANGED = "state_changed";

    pitchShift: number;
    notes: INoteInfo[];
    down: IDownNote[];
    played: ICompositionNote[];
    playerPageComponent: RecorderPlayerPageComponent;

    constructor(notes: INoteInfo[], pitchShift: number, playerPageComponent: RecorderPlayerPageComponent) {
        super();

        this.notes = notes;
        this.down = [];
        this.played = [];
        this.pitchShift = pitchShift;
        this.playerPageComponent = playerPageComponent;
    }

    private isKeyboardEventForNote(note: INoteInfo, e: KeyboardEvent) {
        let position = getUIPositionForNote(note, this.pitchShift);
        return position.keyboardCharacter.toLowerCase() === e.key.toLowerCase();
    }

    addDownNote(note: INoteInfo): boolean {
        if (!this.down.filter(down => note.name === down.note.name)[0]) {
            this.down.push({
                note: note,
                start: new Date().getTime()
            });

            return true;
        }

        return false;
    }

    removeDownNote(note: INoteInfo) {
        const toRemove = this.down.filter(down => note.name === down.note.name)[0] as IDownNote;
        this.down = this.down.filter(down => note.name !== down.note.name);
        let endTime = new Date().getTime();
        const toPush: ICompositionNote = {
            noteInfo: toRemove.note,
            start: this.playerPageComponent.state.videoPosition * 1000 - (endTime - toRemove.start),
            end: this.playerPageComponent.state.videoPosition * 1000
        };
        this.played.push(toPush);
    }

    private emitStateChanged() {
        this.emit(NoteKeyboardManager.STATE_CHANGED, <ITotalNoteState> {
            down: this.down.slice(),
            played: this.played.slice()
        });
    }

    public attachListeners() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            for (let note of this.notes) {
                if (this.isKeyboardEventForNote(note, e)) {
                    if (note.name == "Ds4") {
                        this.playerPageComponent.handleOpenModal();
                        break;
                    }
                    if (this.addDownNote(note)) {
                        this.emit(NoteKeyboardManager.NOTE_START, note);
                        this.emitStateChanged();
                    }
                }
            }
        });

        document.addEventListener("keyup", (e: KeyboardEvent) => {
            for (let note of this.notes) {
                if (this.isKeyboardEventForNote(note, e)) {
                    if (note.name == "Ds4") {
                        break;
                    }
                    this.removeDownNote(note);
                    this.emit(NoteKeyboardManager.NOTE_END, note);
                    this.emitStateChanged();
                }
            }
        });
    }

    public clearPlayedNotes(): void {
        this.played = [];
        this.emitStateChanged();
    }
}

export interface IDownNote {
    note: INoteInfo;
    start: number;
}

export interface ITotalNoteState {
    down: IDownNote[];
    played: ICompositionNote[];
}

export function makeNewITotalNoteState() {
    let down: IDownNote[] = [];
    let played: ICompositionNote[] = [];
    return {
        down: down,
        played: played
    };
}