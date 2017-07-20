import {IDataLayer} from "./IDataLayer";
import {IComposition, makeIComposition} from "../models/IComposition";
import * as sqlite3 from "sqlite3";
import {RunResult} from "sqlite3";
import {generateToken} from "./ComposerTokenLoader";
import {ICompositionNote, makeICompositionNote} from "../models/ICompositionNote";
import {NoteInfoList} from "../models/NoteInfoList";
import {ICompositionState, makeICompositionState} from "../models/ICompositionState";
import * as path from "path";
import {rootPath} from "./Server";
import {INoteInfo} from "../models/INoteInfo";

var fs = require('fs');

export class SQLiteDataLayer implements IDataLayer {
    private static instancePromise: Promise<SQLiteDataLayer> = null;
    private db: sqlite3.Database;

    private constructor() {
        this.makeDirIfNotExists(path.join(rootPath, "data"));
        this.makeDirIfNotExists(path.join(rootPath, "data", "db"));
        sqlite3.verbose();
        const dbPath = path.join(rootPath, "data", "db", "prod_db")
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

    createTables(): Promise<void> {
        return this.execRunWithPromise(
            "CREATE TABLE IF NOT EXISTS compositions " +
            "(edit_token VARCHAR(100), " +
            "view_token VARCHAR(100), " +
            "name VARCHAR(100), " +
            "youtube_id VARCHAR(100), " +
            "recording_youtube_start BIGINT, " +
            "recording_youtube_end BIGINT, " +
            "start_recording_time BIGINT, " +
            "has_recorded BIT, " +
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
        let hasRecorded = (row as any).has_recorded == 1;

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
                    hasRecorded,
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
        console.log("will attempt to insert new composition in DB if none exists");
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
            "has_recorded) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [editToken, viewTokenIfNoneExists, "", "", -1, -1, -1, 0])
            .then(result => {})
            .catch(err => {
                console.log("An error occurred while trying to insert new row.");
                console.log(err);
            });
    }

    getCompositionEdit(editToken: string): Promise<ICompositionState> {
        console.log("attempting to getCompositionEdit");
        return this.execGetWithPromise(
            "SELECT * from compositions WHERE edit_token=?",
            [editToken])
            .then(row => {
                return this.getCompositionFromRow(row);
            })
            .then((composition: IComposition) => {
                return composition.state;
            });
    }

    // getCompositionEdit(editToken: string): Promise<IComposition> {
    //     return this.execRunWithPromise(
    //         // command in SQL is INSERT IGNORE
    //         // in SQLite it is INSERT OR IGNORE
    //         "INSERT OR IGNORE INTO composition_json_table (id, view_token, data) VALUES (?, ?, ?)",
    //         [compositionId, viewTokenIfNoneExists, JSON.stringify(makeNewIComposition("", compositionId))])
    //         .then(() => {
    //             return this.execGetWithPromise(
    //                 "SELECT data from composition_json_table WHERE id=?",
    //                 [compositionId]);
    //         })
    //         .then(row => {
    //             console.log(JSON.parse((row as any).data) as IComposition);
    //             return Promise.resolve(JSON.parse((row as any).data) as IComposition);
    //         });
    // }

    getCompositionView(viewToken: string): Promise<ICompositionState> {
        return this.execGetWithPromise(
            "SELECT * from compositions WHERE view_token=?",
            [viewToken])
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
                return this.execRunWithPromise(
                    "UPDATE compositions " +
                    "SET name=?, " +
                    "youtube_id=?, " +
                    "recording_youtube_start=?, " +
                    "recording_youtube_end=?, " +
                    "start_recording_time=?, " +
                    "has_recorded=? " +
                    "WHERE edit_token=? ",
                    [compositionState.compName,
                        compositionState.youtubeVideoId,
                        compositionState.recordingYoutubeStartTime,
                        compositionState.recordingYoutubeEndTime,
                        compositionState.startRecordingDateTime,
                        compositionState.hasRecorded,
                        editToken]
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