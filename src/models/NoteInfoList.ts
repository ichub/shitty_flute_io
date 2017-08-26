import {INoteInfo, makeINoteInfo} from "./INoteInfo";
import {resDir} from "../server/Server";
import * as path from "path";
import {rootPath} from "../server/Env";

export enum NoteType {
    Regular = "regular",
    Flat = "flat",
    Dummy = "dummy",
}

export class NoteInfoList {
    static readonly notes: INoteInfo[] = [
        // NOTE IDs MUST CORRESPOND TO THEIR ORDERINGS
        // consider making this into a map
        makeINoteInfo(0, "C4", "C", NoteType.Regular, makeSoundFileList("C4")),
        makeINoteInfo(1, "Cs4", "C#", NoteType.Flat, makeSoundFileList("Cs4")),
        makeINoteInfo(2, "D4", "D", NoteType.Regular, makeSoundFileList("D4")),
        makeINoteInfo(3, "Ds4", "D#", NoteType.Flat, makeSoundFileList("Ds4")),
        makeINoteInfo(4, "E4", "E", NoteType.Regular, makeSoundFileList("E4")),
        makeINoteInfo(5, "F4", "F", NoteType.Regular, makeSoundFileList("F4")),
        makeINoteInfo(6, "Fs4", "F#", NoteType.Flat, makeSoundFileList("Fs4")),
        makeINoteInfo(7, "G4", "G", NoteType.Regular, makeSoundFileList("G4")),
        makeINoteInfo(8, "Gs4", "G#", NoteType.Flat, makeSoundFileList("Gs4")),
        makeINoteInfo(9, "A4", "A", NoteType.Regular, makeSoundFileList("A4")),
        makeINoteInfo(10, "As4", "A#", NoteType.Flat, makeSoundFileList("As4")),
        makeINoteInfo(11, "B4", "B", NoteType.Regular, makeSoundFileList("B4")),
        makeINoteInfo(12, "C5", "C", NoteType.Regular, makeSoundFileList("C5")),
        makeINoteInfo(13, "Cs5", "C#", NoteType.Flat, makeSoundFileList("Cs5")),
        makeINoteInfo(14, "D5", "D", NoteType.Regular, makeSoundFileList("D5")),
        makeINoteInfo(15, "Ds5", "D#", NoteType.Flat, makeSoundFileList("Ds5")),
        makeINoteInfo(16, "E5", "E", NoteType.Regular, makeSoundFileList("E5")),
        makeINoteInfo(17, "F5", "F", NoteType.Regular, makeSoundFileList("F5")),
        makeINoteInfo(18, "Fs5", "F#", NoteType.Flat, makeSoundFileList("Fs5")),
        makeINoteInfo(19, "G5", "G", NoteType.Regular, makeSoundFileList("G5")),
        makeINoteInfo(20, "Gs5", "G#", NoteType.Flat, makeSoundFileList("Gs5")),
        makeINoteInfo(21, "A5", "A", NoteType.Regular, makeSoundFileList("A5")),
        makeINoteInfo(22, "As5", "A#", NoteType.Flat, makeSoundFileList("As5")),
        makeINoteInfo(23, "B5", "B", NoteType.Regular, makeSoundFileList("B5")),
        makeINoteInfo(24, "C6", "C", NoteType.Regular, makeSoundFileList("C6")),
        makeINoteInfo(25, "Cs6", "C#", NoteType.Flat, makeSoundFileList("Cs6")),
        makeINoteInfo(26, "D6", "D", NoteType.Regular, makeSoundFileList("D6")),
        makeINoteInfo(27, "Ds6", "D#", NoteType.Flat, makeSoundFileList("Ds6")),
        makeINoteInfo(-1, "", "", NoteType.Dummy, [])
    ];
}

function makeSoundFileList(noteName: string): string[] {
    return ["1", "2", "3", "4", "5", "6"].map(s => rootPath + "res/notes/" + noteName + "-" + s + ".mp3");
}