export interface INoteInfo {
    name: string;
    soundFileUrl: string;
    shittySoundFileUrl: string;
    keyboardCharacter: string;
}

export function makeINoteInfo(name: string, soundFileUrl: string, shittySoundFileUrl: string, keyboardCharacter: string = "") {
    return {
        name: name,
        soundFileUrl: soundFileUrl,
        shittySoundFileUrl: shittySoundFileUrl,
        keyboardCharacter: keyboardCharacter,
    };
}