import {INoteInfo, makeINoteInfo} from "./INoteInfo";

export enum NoteType {
    Regular = "regular",
    Flat = "flat",
    Dummy = "dummy",
}

export class NoteInfoList {
    static readonly notes: INoteInfo[] = [
        // NOTE IDs MUST CORRESPOND TO THEIR ORDERINGS
        // consider making this into a map
        makeINoteInfo(0, "C4", "C", NoteType.Regular, "/res/notes/one-lined/C-Normal.mp3", "/res/notes/one-lined/C-Shitty.mp3"),
        makeINoteInfo(1, "Cs4", "C#", NoteType.Flat, "/res/notes/one-lined/Cs-Normal.mp3", "/res/notes/one-lined/Cs-Shitty.mp3"),
        makeINoteInfo(2, "D4", "D", NoteType.Regular, "/res/notes/one-lined/D-Normal.mp3", "/res/notes/one-lined/D-Shitty.mp3"),
        makeINoteInfo(3, "Ds4", "D#", NoteType.Flat, "/res/notes/one-lined/Ds-Normal.mp3", "/res/notes/one-lined/Ds-Shitty.mp3"),
        makeINoteInfo(4, "E4", "E", NoteType.Regular, "/res/notes/one-lined/E-Normal.mp3", "/res/notes/one-lined/E-Shitty.mp3"),
        makeINoteInfo(5, "F4", "F", NoteType.Regular, "/res/notes/one-lined/F-Normal.mp3", "/res/notes/one-lined/F-Shitty.mp3"),
        makeINoteInfo(6, "Fs4", "F#", NoteType.Flat, "/res/notes/one-lined/Fs-Normal.mp3", "/res/notes/one-lined/Fs-Shitty.mp3"),
        makeINoteInfo(7, "G4", "G", NoteType.Regular, "/res/notes/one-lined/G-Normal.mp3", "/res/notes/one-lined/G-Shitty.mp3"),
        makeINoteInfo(8, "Gs4", "G#", NoteType.Flat, "/res/notes/one-lined/Gs-Normal.mp3", "/res/notes/one-lined/Gs-Shitty.mp3"),
        makeINoteInfo(9, "A4", "A", NoteType.Regular, "/res/notes/one-lined/A-Normal.mp3", "/res/notes/one-lined/A-Shitty.mp3"),
        makeINoteInfo(10, "As4", "A#", NoteType.Flat, "/res/notes/one-lined/As-Normal.mp3", "/res/notes/one-lined/As-Shitty.mp3"),
        makeINoteInfo(11, "B4", "B", NoteType.Regular, "/res/notes/one-lined/B-Normal.mp3", "/res/notes/one-lined/B-Shitty.mp3"),
        makeINoteInfo(12, "C5", "C", NoteType.Regular, "/res/notes/two-lined/High-C-Normal.mp3", "/res/notes/two-lined/High-C-Shitty.mp3"),
        makeINoteInfo(13, "Cs5", "C#", NoteType.Flat, "/res/notes/two-lined/High-Cs-Normal.mp3", "/res/notes/two-lined/High-Cs-Shitty.mp3"),
        makeINoteInfo(14, "D5", "D", NoteType.Regular, "/res/notes/two-lined/High-D-Normal.mp3", "/res/notes/two-lined/High-D-Shitty.mp3"),
        makeINoteInfo(15, "Ds5", "D#", NoteType.Flat, "/res/notes/two-lined/High-Ds-Normal.mp3", "/res/notes/two-lined/High-Ds-Shitty.mp3"),
        makeINoteInfo(16, "E5", "E", NoteType.Regular, "/res/notes/two-lined/High-E-Normal.mp3", "/res/notes/two-lined/High-E-Shitty.mp3"),
        makeINoteInfo(17, "F5", "F", NoteType.Regular, "/res/notes/two-lined/High-F-Normal.mp3", "/res/notes/two-lined/High-F-Shitty.mp3"),
        makeINoteInfo(18, "Fs5", "F#", NoteType.Flat, "/res/notes/two-lined/High-Fs-Normal.mp3", "/res/notes/two-lined/High-Fs-Shitty.mp3"),
        makeINoteInfo(19, "G5", "G", NoteType.Regular, "/res/notes/two-lined/High-G-Normal.mp3", "/res/notes/two-lined/High-G-Shitty.mp3"),
        makeINoteInfo(20, "Gs5", "G#", NoteType.Flat, "/res/notes/two-lined/High-Gs-Normal.mp3", "/res/notes/two-lined/High-Gs-Shitty.mp3"),
        makeINoteInfo(21, "A5", "A", NoteType.Regular, "/res/notes/two-lined/High-A-Normal.mp3", "/res/notes/two-lined/High-A-Shitty.mp3"),
        makeINoteInfo(22, "As5", "A#", NoteType.Flat, "/res/notes/two-lined/High-As-Normal.mp3", "/res/notes/two-lined/High-As-Shitty.mp3"),
        makeINoteInfo(23, "B5", "B", NoteType.Regular, "/res/notes/two-lined/High-B-Normal.mp3", "/res/notes/two-lined/High-B-Shitty.mp3"),
        makeINoteInfo(-1, "", "", NoteType.Dummy, "", "")
    ];
}