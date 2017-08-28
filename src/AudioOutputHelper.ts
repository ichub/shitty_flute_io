import {INoteInfo} from "./models/INoteInfo";
import {ICompositionState} from "./models/ICompositionState";
import {ICompositionNote} from "./models/ICompositionNote";
import {NoteType} from "./models/NoteInfoList";

const axios = require("axios");
const PD = require("probability-distributions");

export class AudioOutputHelper {
    private notes: INoteInfo[];
    private audio: AudioContext;
    private noteToAudioBufferMap: { [name: string]: AudioBuffer[] };
    shittiness: number;

    private constructor(notes: INoteInfo[]) {
        this.notes = notes;
        this.audio = new AudioContext();
        this.noteToAudioBufferMap = {};
        this.shittiness = 0.0;
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
            this.notes.filter(note => note.type != NoteType.Dummy).map(note => {
                this.initializeSingleNote(note)
                    .then((initialized) => {
                        this.noteToAudioBufferMap[initialized.note.name] = initialized.audioBuffers;
                    });
            })
        ).then(() => {
            console.log("initialized audio");
            console.log(this.noteToAudioBufferMap);
        }).catch(err => {
            console.log(err);
            Promise.reject(err);
        });
    }

    private getBufferForFile(soundFileUrl: string): Promise<AudioBuffer> {
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
        return Promise.all(note.soundFileUrls.map((url) => {
                return this.getBufferForFile(url);
            })
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

    private getRandomElementForShittiness(arr: any[], shittiness: number) {
        let denom = 0;
        let thresholds = [];
        for (let i = 0; i < arr.length; i++) {
            denom += (1 - shittiness) * (arr.length - 1 - i) + 0.5;
            thresholds.push(denom);
        }
        for (let i = 0; i < thresholds.length; i++) {
            thresholds[i] /= denom;
        }
        let r = Math.random();
        for (let i = 0; i < thresholds.length; i++) {
            if (r <= thresholds[i]) {
                console.log(i);
                return arr[i];
            }
        }
    }

    public playNote(note: INoteInfo, loop: boolean, duration: number) {
        console.log("playing note: " + note.name + " with duration " + duration.toString());
        const audioBuffer = this.getRandomElementForShittiness(this.noteToAudioBufferMap[note.name], this.shittiness);
        const source = this.audio.createBufferSource();
        source.buffer = audioBuffer;

        const gainNode = this.audio.createGain();
        const delayNode = this.audio.createDelay(1.);

        source.connect(gainNode);
        gainNode.connect(delayNode);
        delayNode.connect(this.audio.destination);

        let delay = 0.;

        if (!loop) {
            if (duration < 1000 && Math.random() < this.shittiness) {
                source.playbackRate.value = PD.rnorm(1, 1, 0.07)[0];
            }
            if (Math.random() < this.shittiness) {
                delay = Math.abs(PD.rnorm(1, 0, 0.15)[0]);
                delayNode.delayTime.value = delay;
            }

            setTimeout(
                () => {
                    gainNode.gain.exponentialRampToValueAtTime(
                        0.00001,
                        this.audio.currentTime + 0.04 + delay
                    );
                },
                duration + 1000 * delay); // TODO: if you want to change duration of note this is where you would do that
        }

        if (loop) {
            source.start();
        } else {
            source.start(0, 0, (duration / 1000) + delay);
        }

        return {
            stop: () => {
                gainNode.gain.exponentialRampToValueAtTime(
                    0.00001,
                    this.audio.currentTime + 0.04
                );
            }
        };
    }

    public playListOfNotes(offset: number, notes: ICompositionNote[]) {
        let stopped = false;
        const stopping = [];

        console.log("playing list of notes");

        for (let completedNote of notes) {
            console.log("attempting to play note: ");
            console.log(completedNote);
            console.log(completedNote.start);
            console.log(offset);
            if (completedNote.start >= offset) {
                setTimeout(
                    () => {
                        if (!stopped) {
                            stopping.push(this.playNote(completedNote.noteInfo, false, completedNote.end - completedNote.start));
                        }
                    },
                    completedNote.start - offset);
            }
        }

        return {
            stop: () => {
                stopped = true;
                for (let stopper of stopping) {
                    stopper.stop();
                }
            }
        };
    }
}

interface IInitializedSound {
    audioBuffers: AudioBuffer[];
    note: INoteInfo;
}