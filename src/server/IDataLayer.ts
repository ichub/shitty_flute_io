/**
 * Created by bgu on 7/14/17.
 */

import {IComposition} from "../models/IComposition";
import {ICompositionState} from "../models/ICompositionState";

export interface IDataLayer {
    getCompositionEdit(compositionId: string): Promise<IComposition>;
    getCompositionView(viewToken: string): Promise<ICompositionState>;
    getViewToken(compositionId: string): Promise<string>;
    saveComposition(compositionId: string, compositionState: ICompositionState): Promise<void>;
}