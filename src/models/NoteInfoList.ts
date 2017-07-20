import {INoteInfo, makeINoteInfo} from "./INoteInfo";

export class NoteInfoList {
    static readonly notes: INoteInfo[] = [
        makeINoteInfo(0, "C4", "C", false, "/res/notes/one-lined/C-Normal.mp3", "/res/notes/one-lined/C-Shitty.mp3", "A"),
        makeINoteInfo(1, "C\#4", "C\#", true, "/res/notes/one-lined/C\#-Normal.mp3", "/res/notes/one-lined/C\#-Shitty.mp3", "W"),
        makeINoteInfo(2, "D4", "D", false, "/res/notes/one-lined/D-Normal.mp3", "/res/notes/one-lined/D-Shitty.mp3", "S"),
        makeINoteInfo(3, "D\#4", "D\#", true, "/res/notes/one-lined/D\#-Normal.mp3", "/res/notes/one-lined/D\#-Shitty.mp3", "E"),
        makeINoteInfo(4, "E4", "E", false, "/res/notes/one-lined/E-Normal.mp3", "/res/notes/one-lined/E-Shitty.mp3", "D"),
        makeINoteInfo(5, "F4", "F", false, "/res/notes/one-lined/F-Normal.mp3", "/res/notes/one-lined/F-Shitty.mp3", "F"),
        makeINoteInfo(6, "F\#4", "F\#", true, "/res/notes/one-lined/F\#-Normal.mp3", "/res/notes/one-lined/F\#-Shitty.mp3", "T"),
        makeINoteInfo(7, "G4", "G", false, "/res/notes/one-lined/G-Normal.mp3", "/res/notes/one-lined/G-Shitty.mp3", "G"),
        makeINoteInfo(8, "G\#4", "G\#", true, "/res/notes/one-lined/G\#-Normal.mp3", "/res/notes/one-lined/G\#-Shitty.mp3", "Y"),
        makeINoteInfo(9, "A4", "A", false, "/res/notes/one-lined/A-Normal.mp3", "/res/notes/one-lined/A-Shitty.mp3", "H"),
        makeINoteInfo(10, "A\#4", "A\#", true, "/res/notes/one-lined/A\#-Normal.mp3", "/res/notes/one-lined/A\#-Shitty.mp3", "U"),
        makeINoteInfo(11, "B4", "B", false, "/res/notes/one-lined/B-Normal.mp3", "/res/notes/one-lined/B-Shitty.mp3", "J"),
        makeINoteInfo(12, "C5", "C", false, "/res/notes/two-lined/High-C-Normal.mp3", "/res/notes/two-lined/High-C-Shitty.mp3", "K"),
        makeINoteInfo(13, "C\#5", "C\#", true, "/res/notes/two-lined/High-C\#-Normal.mp3", "/res/notes/two-lined/High-C\#-Shitty.mp3", "O"),
        makeINoteInfo(14, "D5", "D", false, "/res/notes/two-lined/High-D-Normal.mp3", "/res/notes/two-lined/High-D-Shitty.mp3", "L"),
        makeINoteInfo(15, "D\#5", "D\#", true, "/res/notes/two-lined/High-D\#-Normal.mp3", "/res/notes/two-lined/High-D\#-Shitty.mp3", "P"),
        makeINoteInfo(16, "E5", "E", false, "/res/notes/two-lined/High-E-Normal.mp3", "/res/notes/two-lined/High-E-Shitty.mp3", ";"),
        makeINoteInfo(17, "F5", "F", false, "/res/notes/two-lined/High-F-Normal.mp3", "/res/notes/two-lined/High-F-Shitty.mp3", "'"),
        makeINoteInfo(18, "F\#5", "F\#", true, "/res/notes/two-lined/High-F\#-Normal.mp3", "/res/notes/two-lined/High-F\#-Shitty.mp3", "]"),
        // makeINoteInfo(19, "G5", "G", false, "/res/notes/two-lined/High-G-Normal.mp3", "/res/notes/two-lined/High-G-Shitty.mp3", "+"),
        // makeINoteInfo(20, "G\#5", "G\#", true, "/res/notes/two-lined/High-G\#-Normal.mp3", "/res/notes/two-lined/High-G\#-Shitty.mp3", "+"),
        // makeINoteInfo(21, "A5", "A", false, "/res/notes/two-lined/High-A-Normal.mp3", "/res/notes/two-lined/High-A-Shitty.mp3", "+"),
        // makeINoteInfo(22, "A\#5", "A\#", true, "/res/notes/two-lined/High-A\#-Normal.mp3", "/res/notes/two-lined/High-A\#-Shitty.mp3", "+"),
        // makeINoteInfo(23, "B5", "B", false, "/res/notes/two-lined/High-B-Normal.mp3", "/res/notes/two-lined/High-B-Shitty.mp3", "+")
    ];
}