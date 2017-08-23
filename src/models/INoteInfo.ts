import {NoteType} from "./NoteInfoList";

export interface INoteInfo {
    noteId: number;
    name: string;
    label: string;
    type: NoteType;
    soundFileUrls: string[]
}

export function makeINoteInfo(id: number, name: string, label: string, type: NoteType, soundFileUrls: string[]) {
    return {
        noteId: id,
        name: name,
        label: label,
        type: type,
        soundFileUrls: soundFileUrls,
    };
}