import {INoteUIPosition, makeINoteUIPosition} from "./INoteUIPosition";
import {NoteInfoList} from "./NoteInfoList";
import {INoteInfo} from "./INoteInfo";
/**
 * Created by bgu on 7/22/17.
 */

export enum UIRowType {
    Major = "major",
    Minor = "minor",
}

export class NoteUIPositionList {
    static readonly minorRow: INoteUIRow = makeMinorRow();
    static readonly majorRow: INoteUIRow = makeMajorRow();
}

function makeMinorRow(): INoteUIRow {
    return {
        notePositions: [
            makeINoteUIPosition("W", 1, true, false),
            makeINoteUIPosition("E", 3, true, false),
            makeINoteUIPosition("", -1, true, true),
            makeINoteUIPosition("T", 6, true, false),
            makeINoteUIPosition("Y", 8, true, false),
            makeINoteUIPosition("U", 10, true, false),
            makeINoteUIPosition("", -1, true, true),
            makeINoteUIPosition("O", 13, true, false),
            makeINoteUIPosition("P", 15, true, false),
            // makeINoteUIPosition("", -1, true, true)
        ],
        rowType: UIRowType.Minor
    };
}

function makeMajorRow(): INoteUIRow {
    return {
        notePositions: [
            makeINoteUIPosition("A", 0, false, false),
            makeINoteUIPosition("S", 2, false, false),
            makeINoteUIPosition("D", 4, false, false),
            makeINoteUIPosition("F", 5, false, false),
            makeINoteUIPosition("G", 7, false, false),
            makeINoteUIPosition("H", 9, false, false),
            makeINoteUIPosition("J", 11, false, false),
            makeINoteUIPosition("K", 12, false, false),
            makeINoteUIPosition("L", 14, false, false),
            makeINoteUIPosition(";", 16, false, false),
            // makeINoteUIPosition("'", 17, false, false)
        ],
        rowType: UIRowType.Major
    };
}

export function getUIPositionWithCharacter(character: string): INoteUIPosition {
    for (let position of NoteUIPositionList.minorRow.notePositions) {
        if (position.keyboardCharacter.toLowerCase() == character.toLowerCase()) {
            return position;
        }
    }

    for (let position of NoteUIPositionList.majorRow.notePositions) {
        if (position.keyboardCharacter.toLowerCase() == character.toLowerCase()) {
            return position;
        }
    }
    return null;
}

export function getINoteInfoForPositionIndex(index: number, pitchShift: number, isDummy: boolean = false): INoteInfo {
    if (isDummy || index + pitchShift >= NoteInfoList.notes.length - 1) {
        return NoteInfoList.notes[NoteInfoList.notes.length - 1];
    }
    return NoteInfoList.notes[index + pitchShift];
}

export function getUIPositionForNote(note: INoteInfo, pitchShift: number): INoteUIPosition {
    let ret: INoteUIPosition = makeINoteUIPosition("", -1, false, true);

    for (let position of NoteUIPositionList.minorRow.notePositions) {
        if (position.index == note.noteId - pitchShift) {
            ret = position;
        }
    }

    for (let position of NoteUIPositionList.majorRow.notePositions) {
        if (position.index == note.noteId - pitchShift) {
            ret = position;
        }
    }

    return ret;
}

export interface INoteUIRow {
    notePositions: INoteUIPosition[];
    rowType: UIRowType;
}