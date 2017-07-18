import {MusicPlayerHelper} from "./MusicPlayerHelper";
import {INoteInfo} from "./models/INoteInfo";
import {IComposition} from "./models/IComposition";
const axios = require("axios");

export class AudioOutputHelper {
    private notes: INoteInfo[];
    private audio: AudioContext;
    private noteToAudioBufferMap: { [name: string]: AudioBuffer }; // TODO: map to array of buffers [normal, shitty1, shitty2, etc... ]

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

            axios.get(note.shittySoundFileUrl, {responseType: "arraybuffer"})
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
        const audioBuffer = this.noteToAudioBufferMap[note.name]; // TODO: pick random buffer from array of buffers
        const source = this.audio.createBufferSource();
        source.buffer = audioBuffer;

        const gainNode = this.audio.createGain();

        // TODO: insert a node that does pitch shifting, look up
        // web sound api to figure out how to do this, also figure out
        // what other nodes

        source.connect(gainNode);
        gainNode.connect(this.audio.destination);

        setTimeout(
            () => {
                gainNode.gain.exponentialRampToValueAtTime(
                    0.00001,
                    this.audio.currentTime + 0.04,
                );
            },
            duration); // TODO: if you want to change duration of note this is where you would do that

        source.start(0, 0, duration / 1000/* TODO: also here would be the place to change duration as well, do both */);
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
}

interface IInitializedSound {
    audioBuffer: AudioBuffer;
    note: INoteInfo;
}