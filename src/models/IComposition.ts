/**
 * Created by bgu on 7/14/17.
 */

import {ICompositionNote, makeNewICompositionNote} from "./ICompositionNote";
import {INoteInfo} from "./INoteInfo";

export interface IComposition {
    compositionNotes: ICompositionNote[]
}

export function makeIComposition(compositionNotes: ICompositionNote[]): IComposition {
    return {
        compositionNotes: compositionNotes
    };
}

export function makeNewIComposition(notes: INoteInfo[]): IComposition {
    let compositionNotes = notes.map(makeNewICompositionNote)
    return makeIComposition(compositionNotes)
}