/**
 * Created by bgu on 7/14/17.
 */

import {INoteInfo} from "./INoteInfo";

export interface ICompositionNote {
    noteInfo: INoteInfo
    start: number
    length: number
}

export function makeICompositionNote(note: INoteInfo, start: number, length: number) {
    return {
        note: note,
        start: start,
        length: length
    };
}