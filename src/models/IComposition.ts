/**
 * Created by bgu on 7/14/17.
 */

import {ICompositionNote} from "./ICompositionNote";

export interface IComposition {
    compName: string
    compId: string
    notes: ICompositionNote[]
    youtubeId: string;
}

export function makeIComposition(name: string,
                                 id: string,
                                 notes: ICompositionNote[],
                                 youtubeId: string): IComposition {
    return {
        compName: name,
        compId: id,
        notes: notes,
        youtubeId: youtubeId,
    };
}

export function makeNewIComposition(name: string, id: string): IComposition {
    let notes: ICompositionNote[] = [];
    return makeIComposition(name, id, notes, "HQnC1UHBvWA");
}