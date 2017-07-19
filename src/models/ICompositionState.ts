/**
 * Created by bgu on 7/18/17.
 */
/**
 * Created by bgu on 7/14/17.
 */

import {ICompositionNote} from "./ICompositionNote";

export interface ICompositionState {
    compName: string
    youtubeId: string
    notes: ICompositionNote[]
}

// responding to composer - send entire IComposition
// responding to /view or something like that - send state

export function makeNewICompositionState(): ICompositionState {
    let notes: ICompositionNote[] = []
    return makeICompositionState("", "", notes);
}

export function makeICompositionState(name: string, youtubeId: string, notes: ICompositionNote[]): ICompositionState {
    return {
        compName: name,
        youtubeId: youtubeId,
        notes: notes
    };
}