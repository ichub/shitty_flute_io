import {INoteInfo, makeINoteInfo} from "./INoteInfo";

export class NoteInfoList {
    static readonly notes: INoteInfo[] = [
        makeINoteInfo(0, "C", "/res/notes/one-lined/C-Normal.mp3", "/res/notes/one-lined/C-Shitty.mp3", "A"),
        makeINoteInfo(1, "D", "/res/notes/one-lined/D-Normal.mp3", "/res/notes/one-lined/D-Shitty.mp3", "S"),
        makeINoteInfo(2, "E", "/res/notes/one-lined/E-Normal.mp3", "/res/notes/one-lined/E-Shitty.mp3", "D"),
        makeINoteInfo(3, "F", "/res/notes/one-lined/F-Normal.mp3", "/res/notes/one-lined/F-Shitty.mp3", "F"),
        makeINoteInfo(4, "G", "/res/notes/one-lined/G-Normal.mp3", "/res/notes/one-lined/G-Shitty.mp3", "G"),
        makeINoteInfo(5, "A", "/res/notes/one-lined/A-Normal.mp3", "/res/notes/one-lined/A-Shitty.mp3", "H"),
        makeINoteInfo(6, "B", "/res/notes/one-lined/B-Normal.mp3", "/res/notes/one-lined/B-Shitty.mp3", "J")
    ];
}