/**
 * Created by bgu on 7/14/17.
 */

import {ICompositionNote} from "./ICompositionNote";

export interface IComposition {
    compName: string
    compId: string
    notes: ICompositionNote[]
}

export function makeIComposition(name: string, id: string, notes: ICompositionNote[]): IComposition {
    return {
        compName: name,
        compId: id,
        notes: notes
    };
}

export function makeNewIComposition(name: string, id: string): IComposition {
    let notes: ICompositionNote[] = [];
    return makeIComposition(name, id, notes);
}