/**
 * Created by bgu on 7/14/17.
 */

import {IComposition} from "../models/IComposition";
import {ICompositionState} from "../models/ICompositionState";
import {TimeInterval} from "./SQLiteDataLayer";
import {ICompositionPreview} from "../models/ICompositionPreview";

export interface IDataLayer {
    createCompositionIfNoneExists(editToken: string): Promise<void>;
    getCompositionEdit(editToken: string): Promise<ICompositionState>;
    getCompositionView(viewToken: string): Promise<ICompositionState>;
    getViewToken(editToken: string): Promise<string>;
    getTop(numCompositions: number, timeLimit: TimeInterval): Promise<ICompositionPreview[]>;
    flootify(youtubeId: string, editToken: string): Promise<ICompositionState>;
    saveComposition(editToken: string, compositionState: ICompositionState): Promise<void>;
    cleanUnrecordedCompositions(): Promise<void>
}