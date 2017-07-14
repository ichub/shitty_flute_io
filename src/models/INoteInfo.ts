export interface INoteInfo {
    name: string;
    soundFileUrl: string;
    shittySoundFileUrl: string;

}

export function makeINoteInfo(name: string, soundFileUrl: string, shittySoundFileUrl: string) {
    return {
        name: name,
        soundFileUrl: soundFileUrl,
        shittySoundFileUrl: shittySoundFileUrl,
    };
}