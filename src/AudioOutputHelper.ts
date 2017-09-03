import {INoteInfo} from "./models/INoteInfo";
import {ICompositionState} from "./models/ICompositionState";
import {ICompositionNote} from "./models/ICompositionNote";
import {NoteType} from "./models/NoteInfoList";
import {EventEmitter} from "events";

const axios = require("axios");
const PD = require("probability-distributions");

export class AudioOutputHelper extends EventEmitter {
    public static readonly ON_NOTE_START = "noteStart";
    public static readonly ON_NOTE_END = "noteEnd";

    private notes: INoteInfo[];
    private audio: AudioContext;
    private noteToAudioBufferMap: {[name: string]: AudioBuffer[]};
    private shittiness: number;

    private constructor(notes: INoteInfo[]) {
        super();

        this.notes = notes;
        this.audio = new AudioContext();
        this.noteToAudioBufferMap = {};
        this.shittiness = 0.0;
    }

    public static getInstance(notes: INoteInfo[]): Promise<AudioOutputHelper> {
        const result = new AudioOutputHelper(notes);
        return result.initializeNotes()
            .then(() => Promise.resolve(result));
    }

    private initializeNotes(): Promise<void[]> {
        return Promise.all(
            this.notes.filter(note => note.type != NoteType.Dummy).map(note => {
                this.initializeSingleNote(note)
                    .then((initialized) => {
                        this.noteToAudioBufferMap[initialized.note.name] = initialized.audioBuffers;
                    });
            })
        ).catch(err => {
            console.log(err);
            return Promise.reject(err);
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
                return arr[i];
            }
        }
    }

    public playNote(note: INoteInfo, loop: boolean, duration: number): {stop: () => void, promise: Promise<void>} {
        const audioBuffer = this.getRandomElementForShittiness(this.noteToAudioBufferMap[note.name], this.shittiness);
        const source = this.audio.createBufferSource();
        source.buffer = audioBuffer;

        const gainNode = this.audio.createGain();
        const delayNode = this.audio.createDelay(1.);

        source.connect(gainNode);
        gainNode.connect(delayNode);
        delayNode.connect(this.audio.destination);

        let delay = 0.;

        let resolved = false;
        let resolver = null;

        const promise = new Promise<void>((resolve, reject) => {
            resolver = resolve;

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
                const end = duration + delay;
                source.start(0, 0, end);

                setTimeout(() => {
                        if (!resolved) {
                            resolved = true;
                            resolve();
                        }
                    },
                    end)
            }
        });

        return {
            promise: promise,
            stop: () => {
                if (resolver) {
                    resolver();
                }

                gainNode.gain.exponentialRampToValueAtTime(
                    0.00001,
                    this.audio.currentTime + 0.04
                );
            }
        };
    }

    public playListOfNotes(offset: number, notes: ICompositionNote[]): {stop: () => void} {
        let stopped = false;
        const stopping = [];

        for (let completedNote of notes) {
            if (completedNote.start >= offset) {
                setTimeout(
                    () => {
                        if (!stopped) {
                            this.emit(AudioOutputHelper.ON_NOTE_START, completedNote.noteInfo.noteId);

                            const result = this.playNote(completedNote.noteInfo, false, completedNote.end - completedNote.start);

                            result.promise.then(() => {
                                this.emit(AudioOutputHelper.ON_NOTE_END, completedNote.noteInfo.noteId);
                            });

                            stopping.push(result);
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