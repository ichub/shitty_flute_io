export interface INoteInfo {
    noteId: number;
    name: string;
    soundFileUrl: string;
    shittySoundFileUrl: string;
    keyboardCharacter: string;
}

export function makeINoteInfo(id: number, name: string, soundFileUrl: string, shittySoundFileUrl: string, keyboardCharacter: string = "") {
    return {
        noteId: id,
        name: name,
        soundFileUrl: soundFileUrl,
        shittySoundFileUrl: shittySoundFileUrl,
        keyboardCharacter: keyboardCharacter,
    };
}