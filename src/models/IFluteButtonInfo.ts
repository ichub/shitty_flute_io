export interface IFluteButtonInfo {
    name: string;
    soundFileUrl: string;
    shittySoundFileUrl: string;

}

export function makeIFluteButtonInfo(name: string, soundFileUrl: string, shittySoundFileUrl: string) {
    return {
        name: name,
        soundFileUrl: soundFileUrl,
        shittySoundFileUrl: shittySoundFileUrl,
    };
}