import {INoteInfo, makeINoteInfo} from "./INoteInfo";

export class NoteInfoList {
    static readonly notes: INoteInfo[] = [
        makeINoteInfo(0, "C", "/res/one-lined/notes/C-Normal.mp3", "/res/one-lined/notes/C-Shitty.mp3", "A"),
        makeINoteInfo(1, "D", "/res/one-lined/notes/D-Normal.mp3", "/res/one-lined/notes/D-Shitty.mp3", "S"),
        makeINoteInfo(2, "E", "/res/one-lined/notes/E-Normal.mp3", "/res/one-lined/notes/E-Shitty.mp3", "D"),
        makeINoteInfo(3, "F", "/res/one-lined/notes/F-Normal.mp3", "/res/one-lined/notes/F-Shitty.mp3", "F"),
        makeINoteInfo(4, "G", "/res/one-lined/notes/G-Normal.mp3", "/res/one-lined/notes/G-Shitty.mp3", "G"),
        makeINoteInfo(5, "A", "/res/one-lined/notes/A-Normal.mp3", "/res/one-lined/notes/A-Shitty.mp3", "H"),
        makeINoteInfo(6, "B", "/res/one-lined/notes/B-Normal.mp3", "/res/one-lined/notes/B-Shitty.mp3", "J")
    ];
}