import {INoteInfo, makeINoteInfo} from "./INoteInfo";

export class NoteInfoList {
    static readonly notes: INoteInfo[] = [
        makeINoteInfo(0, "C", "/res/notes/C-Normal.mp3", "/res/notes/C-Shitty.mp3", "A"),
        makeINoteInfo(1, "D", "/res/notes/D-Normal.mp3", "/res/notes/D-Shitty.mp3", "S"),
        makeINoteInfo(2, "E", "/res/notes/E-Normal.mp3", "/res/notes/E-Shitty.mp3", "D"),
        makeINoteInfo(3, "F", "/res/notes/F-Normal.mp3", "/res/notes/F-Shitty.mp3", "F"),
        makeINoteInfo(4, "G", "/res/notes/G-Normal.mp3", "/res/notes/G-Shitty.mp3", "G"),
        makeINoteInfo(5, "A", "/res/notes/A-Normal.mp3", "/res/notes/A-Shitty.mp3", "H"),
        makeINoteInfo(6, "B", "/res/notes/B-Normal.mp3", "/res/notes/B-Shitty.mp3", "J")
    ];
}