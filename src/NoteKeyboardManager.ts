import {INoteInfo} from "./models/INoteInfo";
import {EventEmitter} from "events";
import {ICompositionNote} from "./models/ICompositionNote";

export class NoteKeyboardManager extends EventEmitter {
    public static readonly NOTE_START = "note_start";
    public static readonly NOTE_END = "note_end";
    public static readonly STATE_CHANGED = "state_changed";

    notes: INoteInfo[];
    down: IDownNote[];
    played: ICompositionNote[];

    constructor(notes: INoteInfo[]) {
        super();

        this.notes = notes;
        this.down = [];
        this.played = [];
    }

    private static isKeyboardEventForNote(note: INoteInfo, e: KeyboardEvent) {
        return note.keyboardCharacter.toLowerCase() === e.key.toLowerCase();
    }

    private addDownNote(note: INoteInfo): boolean {
        if (!this.down.filter(down => note.name === down.note.name)[0]) {
            this.down.push({
                note: note,
                start: new Date().getTime(),
            });
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
        this.emit(NoteKeyboardManager.STATE_CHANGED, <ITotalNoteState> {
            down: this.down.slice(),
            played: this.played.slice(),
        });
    }

    public attachListeners() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            for (let note of this.notes) {
                if (NoteKeyboardManager.isKeyboardEventForNote(note, e)) {
                    if (this.addDownNote(note)) {
                        this.emit(NoteKeyboardManager.NOTE_START, note);
                        this.emitStateChanged();
                    }
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