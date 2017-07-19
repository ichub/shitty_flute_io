/**
 * Created by bgu on 7/14/17.
 */

import {IComposition} from "../models/IComposition";
import {ICompositionState} from "../models/ICompositionState";

export interface IDataLayer {
    getCompositionEdit(editToken: string): Promise<IComposition>;
    getCompositionView(viewToken: string): Promise<ICompositionState>;
    getViewToken(editToken: string): Promise<string>;
    saveComposition(editToken: string, compositionState: ICompositionState): Promise<void>;
}