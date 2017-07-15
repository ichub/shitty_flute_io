/**
 * Created by bgu on 7/14/17.
 */

import {IComposition} from "../models/IComposition";

export interface IDataLayer {
    getSongData(compositionId: string): IComposition
}