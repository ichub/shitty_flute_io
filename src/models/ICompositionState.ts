/**
 * Created by bgu on 7/18/17.
 */
/**
 * Created by bgu on 7/14/17.
 */

import {ICompositionNote} from "./ICompositionNote";

export interface ICompositionState {
    compName: string
    youtubeVideoId: string
    recordingYoutubeStartTime: number
    recordingYoutubeEndTime: number
    startRecordingDateTime: number
    hasRecorded: boolean
    lastEdited: number
    viewCount: number
    notes: ICompositionNote[]
}

// responding to composer - send entire IComposition
// responding to /view or something like that - send state

export function makeNewICompositionState(): ICompositionState {
    let notes: ICompositionNote[] = [];
    return makeICompositionState("", "", -1, -1, -1, -1, 0, false, notes);
}

export function makeICompositionState(
    name: string,
    youtubeId: string,
    recordingYoutubeStartTime: number,
    recordingYoutubeEndTime: number,
    startRecordingDateTime: number,
    lastEdited: number,
    viewCount: number,
    hasRecorded: boolean,
    notes: ICompositionNote[]): ICompositionState {
    return {
        compName: name,
        youtubeVideoId: youtubeId,
        recordingYoutubeStartTime: recordingYoutubeStartTime,
        recordingYoutubeEndTime: recordingYoutubeEndTime,
        startRecordingDateTime: startRecordingDateTime,
        hasRecorded: hasRecorded,
        lastEdited: lastEdited,
        viewCount: viewCount,
        notes: notes
    };
}