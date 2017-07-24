import {INoteInfo} from "./models/INoteInfo";
import {EventEmitter} from "events";
import {ICompositionNote} from "./models/ICompositionNote";
import {
    getINoteInfoForPositionIndex, getUIPositionWithCharacter,
    NoteUIPositionList
} from "./models/NoteUIPositionList";

export class NoteKeyboardManager extends EventEmitter {
    public static readonly NOTE_START = "note_start";
    public static readonly NOTE_END = "note_end";
    public static readonly STATE_CHANGED = "state_changed";

    offset: number;
    notes: INoteInfo[];
    down: IDownNote[];
    played: ICompositionNote[];

    constructor(notes: INoteInfo[], offset: number) {
        super();

        this.notes = notes;
        this.down = [];
        this.played = [];
        this.offset = offset;
    }

    private getNoteForKeyboardEvent(e: KeyboardEvent): INoteInfo {
        return getINoteInfoForPositionIndex(getUIPositionWithCharacter(e.key).index, this.offset);
    }

    private static isKeyboardEventForNote(note: INoteInfo, e: KeyboardEvent) {
        return note.keyboardCharacter.toLowerCase() === e.key.toLowerCase();
    }

    private addDownNote(note: INoteInfo): boolean {
        if (!this.down.filter(down => note.name === down.note.name)[0]) {
            this.down.push({
                note: note,
                start: new Date().getTime()
            });
            console.log("pushed down " + note.label);
            return true;
        }

        return false;
    }

    private removeDownNote(note: INoteInfo) {
        const toRemove = this.down.filter(down => note.name === down.note.name)[0] as IDownNote;
        this.down = this.down.filter(down => note.name !== down.note.name);
        const toPush: ICompositionNote = {
            noteInfo: toRemove.note,
            start: toRemove.start,
            end: new Date().getTime()
        };
        this.played.push(toPush);
    }

    private emitStateChanged() {
        console.log("emmitting state change");
        this.emit(NoteKeyboardManager.STATE_CHANGED, <ITotalNoteState> {
            down: this.down.slice(),
            played: this.played.slice()
        });
        console.log("emmitted state change");
    }

    public attachListeners() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            let note = this.getNoteForKeyboardEvent(e);
            if (this.addDownNote(note)) {
                console.log("keydown, " + note.name);
                this.emit(NoteKeyboardManager.NOTE_START, note);
                console.log("emitted note start");
                this.emitStateChanged();
            }
        });

        document.addEventListener("keyup", (e: KeyboardEvent) => {
            let note = this.getNoteForKeyboardEvent(e);
            this.removeDownNote(note);
            this.emit(NoteKeyboardManager.NOTE_END, note);
            this.emitStateChanged();
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