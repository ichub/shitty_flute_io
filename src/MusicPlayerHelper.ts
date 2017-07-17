import {ICompositionNote} from "./models/ICompositionNote";
import * as EventEmitter from "events";

export class MusicPlayerHelper extends EventEmitter {
    public static readonly NOTE_START = "note_start";
    public static readonly NOTE_END = "note_start";

    private notes: ICompositionNote[];
    private timeouts: NodeJS.Timer[];

    constructor(notes: ICompositionNote[]) {
        super();
        this.notes = notes;
        this.timeouts = [];
    }

    playSingleNote(note: ICompositionNote) {
        this.timeouts.push(setTimeout(() => {
                this.emit(MusicPlayerHelper.NOTE_START, note);
                this.timeouts.push(setTimeout(() => {
                        this.emit(MusicPlayerHelper.NOTE_END, note);
                    },
                    note.length));
            },
            note.start));
    }

    playAsynchronously() {
        for (let note of this.notes) {
            this.playSingleNote(note);
        }
    }

    stop() {
        for (let timeout of this.timeouts) {
            clearTimeout(timeout);
        }
    }
}
