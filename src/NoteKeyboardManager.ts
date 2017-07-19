import {INoteInfo} from "./models/INoteInfo";
import {EventEmitter} from "events";

export class NoteKeyboardManager extends EventEmitter {
    public static readonly NOTE_START = "note_start";
    public static readonly NOTE_END = "note_end";
    public static readonly STATE_CHANGED = "state_changed";

    notes: INoteInfo[];
    down: IDownNote[];
    played: IDownNote[];

    constructor(notes: INoteInfo[]) {
        super();

        this.notes = notes;
        this.down = [];
        this.played = [];
    }

    private static isKeyboardEventForNote(note: INoteInfo, e: KeyboardEvent) {
        return note.keyboardCharacter.toLowerCase() === e.key.toLowerCase();
    }

    private addDownNote(note: INoteInfo) {
        this.down.push({
            note: note,
            start: new Date().getTime(),
        });
    }

    private removeDownNote(note: INoteInfo) {
        const toRemove = this.down.filter(down => note.name === down.note.name)[0] as ICompletedNote;
        this.down = this.down.filter(down => note.name !== down.note.name);
        toRemove.end = new Date().getTime();
        this.played.push(toRemove);
    }

    private emitStateChanged() {
        this.emit(NoteKeyboardManager.STATE_CHANGED, {
            down: this.down.slice(0),
            played: this.played.slice(0),
        });
    }

    public attachListeners() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            for (let note of this.notes) {
                if (NoteKeyboardManager.isKeyboardEventForNote(note, e)) {
                    this.addDownNote(note);
                    this.emit(NoteKeyboardManager.NOTE_START, note);
                    this.emitStateChanged();
                }
            }
        });

        document.addEventListener("keyup", (e: KeyboardEvent) => {
            for (let note of this.notes) {
                if (NoteKeyboardManager.isKeyboardEventForNote(note, e)) {
                    this.removeDownNote(note);
                    this.emit(NoteKeyboardManager.NOTE_END, note);
                    this.emitStateChanged();
                }
            }
        });
    }
}

export interface IDownNote {
    note: INoteInfo;
    start: number;
}

export interface ICompletedNote {
    note: INoteInfo;
    start: number;
    end: number;
}

export interface ITotalNoteState {
    down: IDownNote[];
    played: ICompletedNote[];
}