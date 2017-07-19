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
        return result.initializeNotes()
            .then(() => {
                console.log("initialize notes resolves");
            })
            .then(() => Promise.resolve(result));
    }

    private initializeNotes(): Promise<void> {
        return Promise.all(
            this.notes.map(note =>
                this.initializeSingleNote(note)
                    .then((initialized) => {
                        this.noteToAudioBufferMap[initialized.note.name] = initialized.audioBuffers;
                    })),
        ).then(() => {
            console.log("initialized audio");
            console.log(this.noteToAudioBufferMap);
        }).catch(err => {
            console.log(err);
            Promise.reject(err);
        });
    }

    private getBufferForFile(soundFileUrl: string): Promise<AudioBuffer> {
        console.log("retrieving audioBuffer for file " + soundFileUrl);
        return new Promise<AudioBuffer>((resolve, reject) => {
            axios.get(soundFileUrl, {responseType: "arraybuffer"})
                .then(result => {
                    this.audio.decodeAudioData(result.data)
                        .then(data => resolve(data))
                        .catch(err => reject(err));
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
                this.getBufferForFile(note.shittySoundFileUrl),
            ],
        ).then(audioBuffers => {
            return Promise.resolve({
                audioBuffers: audioBuffers,
                note: note,
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
        const delayNode = this.audio.createDelay(1.);

        let shittiness = 0.1;

        // TODO: insert a node that does pitch shifting, look up
        // web sound api to figure out how to do this, also figure out
        // what other nodes

        source.connect(gainNode);
        gainNode.connect(delayNode);
        delayNode.connect(this.audio.destination);

        let delay = 0.;

        if (duration < 1000 && Math.random() < shittiness) {
            source.playbackRate.value = PD.rnorm(1, 1, 0.07)[0];
            delay = Math.abs(PD.rnorm(1, 0, 0.25)[0]);
            delayNode.delayTime.value = delay;
        }

        setTimeout(
            () => {
                gainNode.gain.exponentialRampToValueAtTime(
                    0.00001,
                    this.audio.currentTime + 0.04,
                );
            },
            duration + 1000 * delay); // TODO: if you want to change duration of note this is where you would do that

        source.start(delay, 0, (duration / 1000) + delay /* TODO: also here would be the place to change duration as well, do both */);
    }

    public playComposition(composition: IComposition) {
        for (let note of composition.notes) {
            setTimeout(
                () => {
                    console.log("adding note to play queue");
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