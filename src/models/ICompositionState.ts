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
    lastEdited: number
    viewCount: number
    pitchShift: number
    hasRecorded: boolean
    autoRecorded: boolean
    videoDuration: number
    notes: ICompositionNote[]
}

// responding to composer - send entire IComposition
// responding to /view or something like that - send state

export function makeNewICompositionState(): ICompositionState {
    let notes: ICompositionNote[] = [];
    return makeICompositionState("", "", -1, -1, -1, -1, 0, 0, false, false, -1, notes);
}

export function makeICompositionState(name: string,
                                      youtubeId: string,
                                      recordingYoutubeStartTime: number,
                                      recordingYoutubeEndTime: number,
                                      startRecordingDateTime: number,
                                      lastEdited: number,
                                      viewCount: number,
                                      pitchShift: number,
                                      hasRecorded: boolean,
                                      autoRecorded: boolean,
                                      videoDuration: number,
                                      notes: ICompositionNote[]): ICompositionState {
    return {
        compName: name,
        youtubeVideoId: youtubeId,
        recordingYoutubeStartTime: recordingYoutubeStartTime,
        recordingYoutubeEndTime: recordingYoutubeEndTime,
        startRecordingDateTime: startRecordingDateTime,
        lastEdited: lastEdited,
        viewCount: viewCount,
        pitchShift: pitchShift,
        hasRecorded: hasRecorded,
        autoRecorded: autoRecorded,
        videoDuration: videoDuration,
        notes: notes
    };
}