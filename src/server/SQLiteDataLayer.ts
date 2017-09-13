import {IDataLayer} from "./IDataLayer";
import {IComposition, makeIComposition} from "../models/IComposition";
import * as sqlite3 from "sqlite3";
import {RunResult} from "sqlite3";
import {generateToken} from "./ComposerTokenLoader";
import {ICompositionNote, makeICompositionNote} from "../models/ICompositionNote";
import {NoteInfoList} from "../models/NoteInfoList";
import {ICompositionState, makeICompositionState} from "../models/ICompositionState";
import * as path from "path";
import {INoteInfo} from "../models/INoteInfo";
import {rootPath} from "./Env";
import * as fs from "fs";
import {
    ICompositionPreview,
    makeICompositionPreviewPromise
} from "../models/ICompositionPreview";

const util = require("util");
const exec = require("child_process").exec;

export class SQLiteDataLayer implements IDataLayer {
    private static instancePromise: Promise<SQLiteDataLayer> = null;
    private db: sqlite3.Database;

    private constructor() {
        this.makeDirIfNotExists(path.join(rootPath, "data"));
        this.makeDirIfNotExists(path.join(rootPath, "data", "db"));
        sqlite3.verbose();
        const dbPath = path.join(rootPath, "data", "db", "prod_db");
        this.db = new sqlite3.Database(dbPath);
    }

    private makeDirIfNotExists(path: string) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }

    execRunWithPromise(query: string, params: any[] = []): Promise<RunResult> {
        return new Promise<RunResult>((resolve, reject) => {
            this.db.run(query, params, (err, result) => {
                return (err ? reject(err) : resolve(result));
            });
        });
    }

    execGetWithPromise(query: string, params: any[] = []): Promise<RunResult> {
        return new Promise<RunResult>((resolve, reject) => {
            this.db.get(query, params, (err, result) => {
                return (err ? reject(err) : resolve(result));
            });
        });
    }

    execAllWithPromise(query: string, params: any[] = []): Promise<RunResult[]> {
        return new Promise<RunResult[]>((resolve, reject) => {
            this.db.all(query, params, (err, result) => {
                return (err ? reject(err) : resolve(result));
            });
        });
    }

    execCommandWithPromise(command: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            exec(command, {maxBuffer: 1024 * 1024}, (err, stdout, stderr) => {
                if (err) {
                    return reject(err);
                }
                return resolve(stdout);
            });
        });
    }

    createTables(): Promise<void> {
        return this.execRunWithPromise(
            "CREATE TABLE IF NOT EXISTS compositions " +
            "(edit_token VARCHAR(100), " +
            "view_token VARCHAR(100), " +
            "name VARCHAR(100), " +
            "youtube_id VARCHAR(100), " +
            "recording_youtube_start DOUBLE, " +
            "recording_youtube_end DOUBLE, " +
            "start_recording_time BIGINT, " +
            "last_edited BIGINT, " +
            "view_count INT, " +
            "pitch_shift INT, " +
            "has_recorded BIT, " +
            "auto_recorded BIT, " +
            "video_duration DOUBLE, " +
            "PRIMARY KEY (edit_token), " +
            "UNIQUE (view_token)) ")
            .then(() => {
                return this.execRunWithPromise(
                    "CREATE TABLE IF NOT EXISTS compositions_notes_map " +
                    "(composition_edit_token INT, " +
                    "note_id INT, " +
                    "start INT, " +
                    "end INT)");
            })
            .then(() => {
            });
    }

    getCompositionFromRow(row: RunResult): Promise<IComposition> {
        let editToken = (row as any).edit_token;
        let viewToken = (row as any).view_token;
        let name = (row as any).id;
        let youtubeId = (row as any).youtube_id;
        let recordingYoutubeStart = (row as any).recording_youtube_start;
        let recordingYoutubeEnd = (row as any).recording_youtube_end;
        let startRecordingTime = (row as any).start_recording_time;
        let lastEdited = (row as any).last_edited;
        let viewCount = (row as any).view_count;
        let pitchShift = (row as any).pitch_shift;
        let hasRecorded = (row as any).has_recorded == 1;
        let autoRecorded = (row as any).auto_recorded == 1;
        let videoDuration = (row as any).video_duration;

        return this.execAllWithPromise(
            "SELECT * from compositions_notes_map WHERE composition_edit_token=?",
            [editToken])
            .then(noteMapRows => {
                let notes: ICompositionNote[] = [];
                for (let noteMapRow of noteMapRows) {
                    let noteInfoId = (noteMapRow as any).note_id;
                    let noteInfo = this.getNoteWithId(noteInfoId);
                    let start = (noteMapRow as any).start;
                    let end = (noteMapRow as any).end;
                    let compositionNote = makeICompositionNote(noteInfo, start, end);
                    notes.push(compositionNote);
                }
                let compositionState = makeICompositionState(
                    name,
                    youtubeId,
                    recordingYoutubeStart,
                    recordingYoutubeEnd,
                    startRecordingTime,
                    lastEdited,
                    viewCount,
                    pitchShift,
                    hasRecorded,
                    autoRecorded,
                    videoDuration,
                    notes);
                let composition = makeIComposition(editToken, viewToken, compositionState);
                return composition;
            });
    }

    getNoteWithId(noteInfoId: number): INoteInfo {
        for (let note of NoteInfoList.notes) {
            if (note.noteId == noteInfoId) {
                return note;
            }
        }
    }

    createCompositionIfNoneExists(editToken: string): Promise<void> {
        console.log("will attempt to insert new composition in DB if none exists: " + editToken);
        let viewTokenIfNoneExists = generateToken();
        console.log("view token set (if none already exists) as: " + viewTokenIfNoneExists);
        return this.execRunWithPromise(
            // command in mySQL is INSERT IGNORE
            // in SQLite it is INSERT OR IGNORE
            "INSERT OR IGNORE INTO compositions " +
            "(edit_token, " +
            "view_token, " +
            "name, " +
            "youtube_id, " +
            "recording_youtube_start, " +
            "recording_youtube_end, " +
            "start_recording_time, " +
            "last_edited," +
            "view_count," +
            "pitch_shift," +
            "has_recorded," +
            "auto_recorded, " +
            "video_duration) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [editToken, viewTokenIfNoneExists, "", "FHG2oizTlpY", 0, 1, -1, (new Date()).getTime(), 0, 0, 0, 0, 276.0]) // default song is my heart will go on
            .then(result => {
                console.log("inserted the new row");
            })
            .catch(err => {
                console.log("An error occurred while trying to insert new row.");
                console.log(err);
            });
    }

    getCompositionEdit(editToken: string): Promise<ICompositionState> {
        console.log("attempting to getCompositionEdit");
        return this.execRunWithPromise("UPDATE compositions " +
            "SET view_count=view_count+1 " +
            "WHERE edit_token=?",
            [editToken])
            .then(result => {
                return this.execGetWithPromise(
                    "SELECT * from compositions WHERE edit_token=?",
                    [editToken]);
            })
            .then(row => {
                return this.getCompositionFromRow(row);
            })
            .then((composition: IComposition) => {
                return composition.state;
            });
    }

    getCompositionView(viewToken: string): Promise<ICompositionState> {
        return this.execRunWithPromise("UPDATE compositions " +
            "SET view_count=view_count+1 " +
            "WHERE view_token=?",
            [viewToken])
            .then(result => {
                return this.execGetWithPromise(
                    "SELECT * from compositions WHERE view_token=?",
                    [viewToken]);
            })
            .then(row => {
                return this.getCompositionFromRow(row);
            })
            .then((composition: IComposition) => {
                console.log(composition.state);
                return composition.state;
            });
    }

    getViewToken(editToken: string): Promise<string> {
        return this.execGetWithPromise(
            "SELECT view_token from compositions WHERE edit_token=?",
            [editToken])
            .then(row => {
                return Promise.resolve((row as any).view_token as string);
            })
            .catch(err => {
                console.log(err);
                console.log("No composition with such edit token exists (" + editToken + ")");
                return Promise.reject("No composition with such edit token exists");
            });
    }

    // return view tokens of top 10 most viewed compositions in the last day
    getTop(numCompositions: number, timeLimit: TimeInterval): Promise<ICompositionPreview[]> {
        let thresholdTime = (new Date()).getTime() - timeIntervalToMillis(timeLimit);
        console.log("checking " + timeIntervalToMillis(timeLimit) + " millis in the past");
        return this.execAllWithPromise(
            "SELECT view_token, name, view_count, auto_recorded, youtube_id FROM compositions " +
            "WHERE has_recorded=? " +
            "AND last_edited>? " +
            "ORDER BY view_count DESC " +
            "LIMIT ?",
            [1, thresholdTime, numCompositions])
            .then((rows) => {
                let previews: Promise<ICompositionPreview>[] = [];
                for (let row of rows) {
                    let viewToken = (row as any).view_token;
                    let name = (row as any).name;
                    let viewCount = (row as any).view_count;
                    let autoRecorded = (row as any).auto_recorded == 1;
                    let youtubeId = (row as any).youtube_id;
                    previews.push(makeICompositionPreviewPromise(viewToken, name, "", viewCount, autoRecorded, youtubeId));
                }
                return Promise.all(previews);
            })
            .catch(err => {
                console.log("Failed to retrieve top 10.");
                return Promise.reject(err);
            });
    }

    async flootify(youtubeId: string, editToken: string): Promise<ICompositionState> {
        console.log("Attempting to flootify...");
        let compositionState: ICompositionState = null;
        let script_path = path.join(rootPath, "scripts", "flootify.py");
        let row: RunResult = await this.execGetWithPromise(
            "SELECT * from compositions WHERE youtube_id=? AND auto_recorded=?",
            [youtubeId, 1]);

        if (!row) {
            const result = await this.execCommandWithPromise("python " + script_path + " " + youtubeId);
            console.log("flootified video with id " + youtubeId);
            compositionState = JSON.parse(result) as ICompositionState;
        } else {
            const composition = await this.getCompositionFromRow(row);
            compositionState = composition.state;
        }

        return this.saveComposition(editToken, compositionState)
            .then(() => {
                return Promise.resolve(compositionState);
            });
    }

    saveComposition(editToken: string, compositionState: ICompositionState): Promise<void> {
        console.log("trying to get row for save operation");
        return this.execGetWithPromise(
            "SELECT * from compositions WHERE edit_token=?",
            [editToken])
            .then(row => {
                console.log("successfully found row");
                console.log(row);
                return this.execRunWithPromise(
                    "DELETE FROM compositions_notes_map WHERE composition_edit_token=?",
                    [editToken]);
            })
            .then(() => {
                console.log("deleted old notes");
                return Promise.all(
                    compositionState.notes.map(note => {
                            this.execRunWithPromise(
                                "INSERT INTO compositions_notes_map (composition_edit_token, note_id, start, end) VALUES (?, ?, ?, ?)",
                                [editToken, note.noteInfo.noteId, note.start, note.end]
                            );
                        }
                    )
                );
            })
            .then(() => {
                console.log("inserted new notes");
                console.log(editToken);
                console.log("record end time is " + compositionState.recordingYoutubeEndTime);
                return this.execRunWithPromise(
                    "UPDATE compositions " +
                    "SET name=?, " +
                    "youtube_id=?, " +
                    "recording_youtube_start=?, " +
                    "recording_youtube_end=?, " +
                    "start_recording_time=?, " +
                    "last_edited=?, " +
                    "view_count=0, " +
                    "pitch_shift=?, " +
                    "has_recorded=?, " +
                    "auto_recorded=?, " +
                    "video_duration=? " +
                    "WHERE edit_token=?",
                    [compositionState.compName,
                        compositionState.youtubeVideoId,
                        compositionState.recordingYoutubeStartTime,
                        compositionState.recordingYoutubeEndTime,
                        compositionState.startRecordingDateTime,
                        compositionState.lastEdited,
                        compositionState.pitchShift,
                        compositionState.hasRecorded,
                        compositionState.autoRecorded,
                        compositionState.videoDuration,
                        editToken] // note that we reset the view_count when a composition is updated
                );
            })
            .then(() => {
                console.log("saved into compositions table");
            })
            .catch((err) => {
                console.log("Something went wrong in saving composition. You should probably check database integrity.");
                Promise.reject(err);
            });
    }

    cleanUnrecordedCompositions(): Promise<void> {
        let thresholdTime = (new Date()).getTime() - 1000 * 60 * 60 * 24;
        return this.execRunWithPromise(
            "DELETE FROM compositions " +
            "WHERE has_recorded=? " +
            "AND last_edited<?", [0, thresholdTime])
            .then(() => {
                console.log("Cleaned successfully");
            })
            .catch(err => {
                console.log("Failed to delete rows.");
                Promise.reject(err);
            });
    }

    static getInstance(): Promise<SQLiteDataLayer> {
        if (SQLiteDataLayer.instancePromise !== null) {
            return SQLiteDataLayer.instancePromise;
        }

        SQLiteDataLayer.instancePromise = new Promise<SQLiteDataLayer>((resolve, reject) => {
            const dataLayer = new SQLiteDataLayer();

            dataLayer.createTables()
                .then(() => {
                    resolve(dataLayer);
                })
                .catch(err => {
                    console.log("WARNING: FAILED TO GET INSTANCE OF DATA LAYER");
                    console.log(err);
                    process.exit(100);
                    reject(err);
                });
        });

        return SQLiteDataLayer.instancePromise;
    }
}

export enum TimeInterval {
    Day = "day",
    Week = "week",
    Month = "month",
    AllTime = "all_time",
}

export function timeIntervalToMillis(timeInterval: TimeInterval): number {
    switch (timeInterval) {
        case "day": {
            return 1000 * 60 * 60 * 24;
        }
        case "week": {
            return 1000 * 60 * 60 * 24 * 7;
        }
        case "month": {
            return 1000 * 60 * 60 * 24 * 31;
        }
        case "all_time": {
            return 1000 * 60 * 60 * 24 * 365 * 30;
        }
        default: {
            return 0;
        }
    }
}
