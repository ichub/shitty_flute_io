import {ICompositionNote} from "./models/ICompositionNote";
import * as EventEmitter from "events";

export class MusicPlayerHelper extends EventEmitter {
    public static readonly NOTE_START = "note_start";
    public static readonly NOTE_END = "note_start";
    public static readonly COMPOSITION_END = "end";

    private notes: ICompositionNote[];
    private timeouts: NodeJS.Timer[];
    private hasPlayed: boolean;

    constructor(notes: ICompositionNote[]) {
        super();
        this.notes = notes;
        this.timeouts = [];
    }

    playAsynchronously() {
        if (this.hasPlayed) {
            throw new Error("this player has already played");
        }

        if (this.notes.length === 0) {
            this.emit(MusicPlayerHelper.COMPOSITION_END);
            return;
        }

        this.hasPlayed = true;

        let maxNoteEnd = -1;
        let maxNote = null;

        for (let note of this.notes) {
            const noteEnd = note.start + note.length;

            if (noteEnd > maxNoteEnd) {
                maxNote = note;
                maxNoteEnd = noteEnd;
            }

            this.timeouts.push(setTimeout(() => {
                    this.emit(MusicPlayerHelper.NOTE_START, note);
                    this.timeouts.push(setTimeout(() => {
                            this.emit(MusicPlayerHelper.NOTE_END, note);

                            if (maxNote === note) {
                                this.emit(MusicPlayerHelper.COMPOSITION_END);
                            }
                        },
                        note.length));
                },
                note.start));
        }
    }

    stop() {
        for (let timeout of this.timeouts) {
            clearTimeout(timeout);
        }

        this.timeouts = [];
    }
}
