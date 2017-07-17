/**
 * Created by bgu on 7/14/17.
 */

import {IComposition} from "../models/IComposition";

export interface IDataLayer {
    getComposition(compositionId: string): Promise<IComposition>;
    saveComposition(compositionId: string, composition: IComposition): Promise<IComposition>;
}