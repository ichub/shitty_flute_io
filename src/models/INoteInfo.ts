export interface INoteInfo {
    noteId: number;
    name: string;
    label: string;
    isFlat: boolean;
    soundFileUrl: string;
    shittySoundFileUrl: string;
    keyboardCharacter: string;
}

export function makeINoteInfo(id: number, name: string, label: string, isFlat: boolean, soundFileUrl: string, shittySoundFileUrl: string, keyboardCharacter: string = "") {
    return {
        noteId: id,
        name: name,
        label: label,
        isFlat: isFlat,
        soundFileUrl: soundFileUrl,
        shittySoundFileUrl: shittySoundFileUrl,
        keyboardCharacter: keyboardCharacter,
    };
}