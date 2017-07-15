/**
 * Created by bgu on 7/14/17.
 */

import {INoteInfo} from "./INoteInfo";

export interface ICompositionNote {
    note: INoteInfo
    musicData: number[] // 0 is off, 1 is start, 2 is continue
    length: number
}

export function makeICompositionNote(note: INoteInfo, musicData: number[]) {
    return {
        note: note,
        musicData: musicData,
        length: musicData.length
    };
}

export function makeNewICompositionNote(note: INoteInfo) {
    let musicData: number[] = [];
    return makeICompositionNote(note, musicData);
}