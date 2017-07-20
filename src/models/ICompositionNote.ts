/**
 * Created by bgu on 7/14/17.
 */

import {INoteInfo} from "./INoteInfo";

export interface ICompositionNote {
    noteInfo: INoteInfo
    start: number
    end: number
}

export function makeICompositionNote(note: INoteInfo, start: number, end: number): ICompositionNote {
    return {
        noteInfo: note,
        start: start,
        end: end
    };
}