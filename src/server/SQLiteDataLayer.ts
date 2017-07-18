import {IDataLayer} from "./IDataLayer";
import {IComposition, makeNewIComposition} from "../models/IComposition";
import * as sqlite3 from "sqlite3";
import {RunResult} from "sqlite3";

export class SQLiteDataLayer implements IDataLayer {
    private static instancePromise: Promise<SQLiteDataLayer> = null;
    private db: sqlite3.Database;

    private constructor() {
        sqlite3.verbose();
        this.db = new sqlite3.Database(":memory:");
    }

    execRunWithPromise(query: string, params: any[] = []): Promise<RunResult> {
        return new Promise<RunResult>((resolve, reject) => {
            this.db.run(query, params, (err, result) => {
                // console.log(query);
                // console.log(params);

                if (err) {
                    // console.log(`failed to run query: ${query}`);
                    // console.log(err);
                    reject(err);
                } else {
                    // console.log(`succeeded running query: ${query}`);
                    // console.log(result);
                    resolve(result);
                }
            });
        });
    }

    execGetWithPromise(query: string, params: any[] = []): Promise<RunResult> {
        return new Promise<RunResult>((resolve, reject) => {
            this.db.get(query, params, (err, result) => {
                // console.log(query);
                // console.log(params);

                if (err) {
                    // console.log(`failed to run query: ${query}`);
                    // console.log(err);
                    reject(err);
                } else {
                    // console.log(`succeeded running query: ${query}`);
                    // console.log(result);
                    resolve(result);
                }
            });
        });
    }

    createTables(): Promise<void> {
        return this.execRunWithPromise(
            "CREATE TABLE compositions " +
            "(id VARCHAR(100)," +
            "name VARCHAR(100))")
            .then(() => {
                return this.execRunWithPromise(
                    "CREATE TABLE compositions_notes_map " +
                    "(id VARCHAR(100)," +
                    "note_id INT," +
                    "start BIGINT," +
                    "length BIGINT)");
            })
            .then(() => {
                return this.execRunWithPromise(
                    "CREATE TABLE note_info " +
                    "(id INT," +
                    "name VARCHAR(100)," +
                    "sound_file VARCHAR(100)," +
                    "shitty_sound_file VARCHAR(100)," +
                    "keyboard_character VARCHAR(1))");
            })
            .then(() => {
                return this.execRunWithPromise(
                    "CREATE TABLE composition_json_table " +
                    "(id VARCHAR(100)," +
                    "data TEXT," +
                    "PRIMARY KEY (id))");
            });
    }

    getComposition(compositionId: string): Promise<IComposition> {
        return this.execRunWithPromise(
            "INSERT OR IGNORE INTO composition_json_table (id, data) VALUES (?, ?)",
            [compositionId, JSON.stringify(makeNewIComposition("", compositionId))])
            .then(() => {
            return this.execGetWithPromise(
                    "SELECT data from composition_json_table WHERE id=?",
                    [compositionId]);
            })
            .then(row => {
                console.log(JSON.parse((row as any).data) as IComposition);
                return Promise.resolve(JSON.parse((row as any).data) as IComposition);
            });
    }

    saveComposition(compositionId: string, composition: IComposition): Promise<void> {
        const data = JSON.stringify(composition);
        return this.execRunWithPromise(
            "INSERT INTO composition_json_table (id, data) VALUES (?,?)",
            [compositionId, data]);
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