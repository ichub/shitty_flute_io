import {INoteInfo} from "./models/INoteInfo";
import {EventEmitter} from "events";
import {ICompositionNote} from "./models/ICompositionNote";
import {
    getINoteInfoForPositionIndex, getUIPositionForNote, getUIPositionWithCharacter,
    NoteUIPositionList
} from "./models/NoteUIPositionList";

export class NoteKeyboardManager extends EventEmitter {
    public static readonly NOTE_START = "note_start";
    public static readonly NOTE_END = "note_end";
    public static readonly STATE_CHANGED = "state_changed";

    pitchShift: number;
    notes: INoteInfo[];
    down: IDownNote[];
    played: ICompositionNote[];

    constructor(notes: INoteInfo[], pitchShift: number) {
        super();

        this.notes = notes;
        this.down = [];
        this.played = [];
        this.pitchShift = pitchShift;
    }

    private isKeyboardEventForNote(note: INoteInfo, e: KeyboardEvent) {
        let position = getUIPositionForNote(note, this.pitchShift);
        return position.keyboardCharacter.toLowerCase() === e.key.toLowerCase();
    }

    private addDownNote(note: INoteInfo): boolean {
        console.log("adding down note");
        if (!this.down.filter(down => note.name === down.note.name)[0]) {
            this.down.push({
                note: note,
                start: new Date().getTime()
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
        console.log("aaaaa");
        this.emit(NoteKeyboardManager.STATE_CHANGED, <ITotalNoteState> {
            down: this.down.slice(),
            played: this.played.slice()
        });
    }

    public attachListeners() {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            for (let note of this.notes) {
                if (this.isKeyboardEventForNote(note, e)) {
                    console.log("note down");
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