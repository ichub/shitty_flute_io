/**
 * Created by bgu on 7/17/17.
 */

export interface ISongInfo {
    name: string;
    soundFileUrl: string;
}

export function makeISongInfo(name: string, soundFileUrl: string) {
    return {
        name: name,
        soundFileUrl: soundFileUrl,
    };
}