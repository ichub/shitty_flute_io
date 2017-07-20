import {INoteInfo, makeINoteInfo} from "./INoteInfo";

export class NoteInfoList {
    static readonly notes: INoteInfo[] = [
        makeINoteInfo(0, "C4", "C", false, "/res/notes/one-lined/C-Normal.mp3", "/res/notes/one-lined/C-Shitty.mp3", "A"),
        makeINoteInfo(1, "Cs4", "Cs", true, "/res/notes/one-lined/Cs-Normal.mp3", "/res/notes/one-lined/Cs-Shitty.mp3", "W"),
        makeINoteInfo(2, "D4", "D", false, "/res/notes/one-lined/D-Normal.mp3", "/res/notes/one-lined/D-Shitty.mp3", "S"),
        makeINoteInfo(3, "Ds4", "Ds", true, "/res/notes/one-lined/Ds-Normal.mp3", "/res/notes/one-lined/Ds-Shitty.mp3", "E"),
        makeINoteInfo(4, "E4", "E", false, "/res/notes/one-lined/E-Normal.mp3", "/res/notes/one-lined/E-Shitty.mp3", "D"),
        makeINoteInfo(5, "F4", "F", false, "/res/notes/one-lined/F-Normal.mp3", "/res/notes/one-lined/F-Shitty.mp3", "F"),
        makeINoteInfo(6, "Fs4", "Fs", true, "/res/notes/one-lined/Fs-Normal.mp3", "/res/notes/one-lined/Fs-Shitty.mp3", "T"),
        makeINoteInfo(7, "G4", "G", false, "/res/notes/one-lined/G-Normal.mp3", "/res/notes/one-lined/G-Shitty.mp3", "G"),
        makeINoteInfo(8, "Gs4", "Gs", true, "/res/notes/one-lined/Gs-Normal.mp3", "/res/notes/one-lined/Gs-Shitty.mp3", "Y"),
        makeINoteInfo(9, "A4", "A", false, "/res/notes/one-lined/A-Normal.mp3", "/res/notes/one-lined/A-Shitty.mp3", "H"),
        makeINoteInfo(10, "As4", "As", true, "/res/notes/one-lined/As-Normal.mp3", "/res/notes/one-lined/As-Shitty.mp3", "U"),
        makeINoteInfo(11, "B4", "B", false, "/res/notes/one-lined/B-Normal.mp3", "/res/notes/one-lined/B-Shitty.mp3", "J"),
        makeINoteInfo(12, "C5", "C", false, "/res/notes/two-lined/High-C-Normal.mp3", "/res/notes/two-lined/High-C-Shitty.mp3", "K"),
        makeINoteInfo(13, "Cs5", "Cs", true, "/res/notes/two-lined/High-Cs-Normal.mp3", "/res/notes/two-lined/High-Cs-Shitty.mp3", "O"),
        makeINoteInfo(14, "D5", "D", false, "/res/notes/two-lined/High-D-Normal.mp3", "/res/notes/two-lined/High-D-Shitty.mp3", "L"),
        makeINoteInfo(15, "Ds5", "Ds", true, "/res/notes/two-lined/High-Ds-Normal.mp3", "/res/notes/two-lined/High-Ds-Shitty.mp3", "P"),
        makeINoteInfo(16, "E5", "E", false, "/res/notes/two-lined/High-E-Normal.mp3", "/res/notes/two-lined/High-E-Shitty.mp3", ";"),
        makeINoteInfo(17, "F5", "F", false, "/res/notes/two-lined/High-F-Normal.mp3", "/res/notes/two-lined/High-F-Shitty.mp3", "'"),
        makeINoteInfo(18, "Fs5", "Fs", true, "/res/notes/two-lined/High-Fs-Normal.mp3", "/res/notes/two-lined/High-Fs-Shitty.mp3", "]"),
        // makeINoteInfo(19, "G5", "G", false, "/res/notes/two-lined/High-G-Normal.mp3", "/res/notes/two-lined/High-G-Shitty.mp3", "+"),
        // makeINoteInfo(20, "Gs5", "Gs", true, "/res/notes/two-lined/High-Gs-Normal.mp3", "/res/notes/two-lined/High-Gs-Shitty.mp3", "+"),
        // makeINoteInfo(21, "A5", "A", false, "/res/notes/two-lined/High-A-Normal.mp3", "/res/notes/two-lined/High-A-Shitty.mp3", "+"),
        // makeINoteInfo(22, "As5", "As", true, "/res/notes/two-lined/High-As-Normal.mp3", "/res/notes/two-lined/High-As-Shitty.mp3", "+"),
        // makeINoteInfo(23, "B5", "B", false, "/res/notes/two-lined/High-B-Normal.mp3", "/res/notes/two-lined/High-B-Shitty.mp3", "+")
    ];
}