import {AudioOutputHelper} from "./AudioOutputHelper";
import {INoteInfo} from "./models/INoteInfo";

export class SingleNotePlayer {
    private noteStopMap = {};

    playNote(audio: AudioOutputHelper, note: INoteInfo) {
        if (!this.noteStopMap[note.name]) {
            this.noteStopMap[note.name] = audio.playNote(note, true, 100000);
        }
    }

    stopNote(audio: AudioOutputHelper, note: INoteInfo) {
        if (this.noteStopMap[note.name]) {
            this.noteStopMap[note.name].stop();
            this.noteStopMap[note.name] = null;
        }
    }
}