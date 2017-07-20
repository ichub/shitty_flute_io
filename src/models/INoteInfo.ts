import {NoteType} from "./NoteInfoList";

export interface INoteInfo {
    noteId: number;
    name: string;
    label: string;
    type: NoteType;
    soundFileUrl: string;
    shittySoundFileUrl: string;
    keyboardCharacter: string;
}

export function makeINoteInfo(id: number, name: string, label: string, type: NoteType, soundFileUrl: string, shittySoundFileUrl: string, keyboardCharacter: string = "") {
    return {
        noteId: id,
        name: name,
        label: label,
        type: type,
        soundFileUrl: soundFileUrl,
        shittySoundFileUrl: shittySoundFileUrl,
        keyboardCharacter: keyboardCharacter,
    };
}