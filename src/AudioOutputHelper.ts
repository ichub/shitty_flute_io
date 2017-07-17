import {MusicPlayerHelper} from "./MusicPlayerHelper";
import {INoteInfo} from "./models/INoteInfo";
import {IComposition} from "./models/IComposition";
const axios = require("axios");

export class AudioOutputHelper {
    private notes: INoteInfo[];
    private audio: AudioContext;
    private noteToAudioBufferMap: { [name: string]: AudioBuffer };

    private constructor(notes: INoteInfo[]) {
        this.notes = notes;
        this.audio = new AudioContext();
        this.noteToAudioBufferMap = {};
    }

    public static fromNotes(notes: INoteInfo[]): Promise<AudioOutputHelper> {
        const result = new AudioOutputHelper(notes);
        window["audio"] = result;
        return result.initializeNotes().then(() => Promise.resolve(result));
    }

    private initializeNotes(): Promise<void> {
        return Promise.all(
            this.notes.map(note =>
                this.initializeSingleNote(note)
                    .then((initialized) => {
                        this.noteToAudioBufferMap[initialized.note.name] = initialized.audioBuffer;
                    })),
        ).then(() => {
            console.log("initialized audio");
            console.log(this.noteToAudioBufferMap);
        });
    }

    private initializeSingleNote(note: INoteInfo): Promise<IInitializedSound> {
        return new Promise<IInitializedSound>((resolve, reject) => {

            axios.get(note.soundFileUrl, {responseType: "arraybuffer"})
                .then(result => {
                    return this.audio.decodeAudioData(result.data);
                })
                .then(audioBuffer => {
                    resolve({
                        audioBuffer: audioBuffer,
                        note: note,
                    });
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    private playNote(note: INoteInfo, duration: number) {
        const audioBuffer = this.noteToAudioBufferMap[note.name];
        const source = this.audio.createBufferSource();
        source.buffer = audioBuffer;

        const gainNode = this.audio.createGain();
        source.connect(gainNode);
        gainNode.connect(this.audio.destination);

        setTimeout(
            () => {
                gainNode.gain.exponentialRampToValueAtTime(
                    0.00001,
                    this.audio.currentTime + 0.04,
                );
            },
            duration);

        source.start(0, 0, duration / 1000);
    }

    public playComposition(composition: IComposition) {
        for (let note of composition.notes) {
            setTimeout(
                () => {
                    this.playNote(note.noteInfo, note.length);
                },
                note.start);
        }
    }

    attachToMusicPlayerHelper(helper: MusicPlayerHelper) {

    }
}

interface IInitializedSound {
    audioBuffer: AudioBuffer;
    note: INoteInfo;
}