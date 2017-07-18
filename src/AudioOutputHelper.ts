import {MusicPlayerHelper} from "./MusicPlayerHelper";
import {INoteInfo} from "./models/INoteInfo";
import {IComposition} from "./models/IComposition";
const axios = require("axios");
const PD = require("probability-distributions");


export class AudioOutputHelper {
    private notes: INoteInfo[];
    private audio: AudioContext;
    private noteToAudioBufferMap: { [name: string]: AudioBuffer[] }; // TODO: map to array of buffers [normal, shitty1, shitty2, etc... ]

    private constructor(notes: INoteInfo[]) {
        this.notes = notes;
        this.audio = new AudioContext();
        this.noteToAudioBufferMap = {};
    }

    public static getInstance(notes: INoteInfo[]): Promise<AudioOutputHelper> {
        const result = new AudioOutputHelper(notes);
        return result.initializeNotes().then(() => Promise.resolve(result));
    }

    private initializeNotes(): Promise<void> {
        return Promise.all(
            this.notes.map(note =>
                this.initializeSingleNote(note)
                    .then((initialized) => {
                        this.noteToAudioBufferMap[initialized.note.name] = initialized.audioBuffers;
                    }))
        ).then(() => {
            console.log("initialized audio");
            console.log(this.noteToAudioBufferMap);
        });
    }

    private getBufferForFile(soundFileUrl: string): Promise<AudioBuffer> {
        console.log("retrieving audioBuffer for file " + soundFileUrl);
        return new Promise<AudioBuffer>((resolve, reject) => {
            axios.get(soundFileUrl, {responseType: "arraybuffer"})
                .then(result => {
                    return this.audio.decodeAudioData(result.data);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    private initializeSingleNote(note: INoteInfo): Promise<IInitializedSound> {
        return Promise.all(
            [
                this.getBufferForFile(note.soundFileUrl),
                this.getBufferForFile(note.shittySoundFileUrl)
            ]
        ).then(audioBuffers => {
            return Promise.resolve({
                audioBuffers: audioBuffers,
                note: note
            });
        });
    }

    private getRandomElement(arr: any[]) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    private playNote(note: INoteInfo, duration: number) {
        console.log("attempting to play note");
        const audioBuffer = this.getRandomElement(this.noteToAudioBufferMap[note.name]); // TODO: pick random buffer from array of buffers
        const source = this.audio.createBufferSource();
        source.buffer = audioBuffer;

        const gainNode = this.audio.createGain();
        const sourceNode = this.audio.createBufferSource();

        let shittiness = 0.05;

        // TODO: insert a node that does pitch shifting, look up
        // web sound api to figure out how to do this, also figure out
        // what other nodes

        source.connect(sourceNode);
        sourceNode.connect(gainNode);
        gainNode.connect(this.audio.destination);

        setTimeout(
            () => {
                gainNode.gain.exponentialRampToValueAtTime(
                    0.00001,
                    this.audio.currentTime + 0.04
                );
                if (duration < 1000 && Math.random() < shittiness) {
                    sourceNode.playbackRate.value = PD.lnorm(1, 0, 0.07)[0];
                }
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
    audioBuffers: AudioBuffer[];
    note: INoteInfo;
}