/**
 * Created by bgu on 7/14/17.
 */

import {IComposition} from "../models/IComposition";

export interface IDataLayer {
    getCompositionEdit(compositionId: string): Promise<IComposition>;
    getCompositionView(viewToken: string): Promise<IComposition>;
    getViewToken(compositionId: string): Promise<string>;
    saveComposition(compositionId: string, composition: IComposition): Promise<void>;

}