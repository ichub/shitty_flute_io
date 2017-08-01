/**
 * Created by bgu on 7/14/17.
 */

import {IComposition} from "../models/IComposition";
import {ICompositionState} from "../models/ICompositionState";
import {TimeInterval} from "./SQLiteDataLayer";

export interface IDataLayer {
    createCompositionIfNoneExists(editToken: string): Promise<void>;
    getCompositionEdit(editToken: string): Promise<ICompositionState>;
    getCompositionView(viewToken: string): Promise<ICompositionState>;
    getViewToken(editToken: string): Promise<string>;
    getTopTen(timeLimit: TimeInterval): Promise<string[]>;
    flootify(youtubeId: string): Promise<ICompositionState>;
    saveComposition(editToken: string, compositionState: ICompositionState): Promise<void>;
    cleanUnrecordedCompositions(): Promise<void>
}