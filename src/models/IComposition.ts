/**
 * Created by bgu on 7/14/17.
 */

import {ICompositionState, makeNewICompositionState} from "./ICompositionState";

export interface IComposition {
    id: number
    editToken: string
    viewToken: string
    state: ICompositionState
}

// responding to composer - send entire IComposition
// responding to /view or something like that - send state

export function makeIComposition(id: number, editToken: string, viewToken: string, state: ICompositionState): IComposition {
    return {
        id: id,
        editToken: editToken,
        viewToken: viewToken,
        state: state
    };
}

export function makeNewIComposition(id: number, editToken: string, viewToken: string): IComposition {
    let state = makeNewICompositionState();
    return makeIComposition(id, editToken, viewToken, state);
}