import {IDataLayer} from "./IDataLayer";
import {IComposition} from "../models/IComposition";
import * as sqlite3 from "sqlite3";

export class SQLiteDataLayer implements IDataLayer {
    private static instancePromise: Promise<SQLiteDataLayer> = null;
    private db: sqlite3.Database;

    private constructor() {
        sqlite3.verbose();
        this.db = new sqlite3.Database(":memory:");
    }

    createTables(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("CREATE TABLE compositions" +
                    "(id VARCHAR(100)," +
                    "name VARCHAR(100)," +
                    "CONSTRAINT compositions_pk PRIMARY_KEY(id))",
                    []);
                this.db.run("CREATE TABLE compositions_notes_map" +
                    "(id VARCHAR(100)," +
                    "note_id INT," +
                    "start BIGINT," +
                    "length BIGINT)");
                this.db.run("CREATE TABLE note_info" +
                    "(id INT," +
                    "name VARCHAR(100)," +
                    "sound_file VARCHAR(100)," +
                    "shitty_sound_file VARCHAR(100)," +
                    "keyboard_character VARCHAR(1)," +
                    "CONSTRAINT note_info_pk PRIMARY KEY (id))");
                this.db.run("CREATE TABLE composition_json_table (id VARCHAR(100)," +
                    "data TEXT," +
                    "CONSTRAINT composition_json_table_pk PRIMARY_KEY(id))");

                resolve();
            });
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
                    reject(err);
                });
        });

        return SQLiteDataLayer.instancePromise;
    }

    private resolveJson(data: string) {
        return Promise.resolve(JSON.parse(data));
    }

    getComposition(compositionId: string): Promise<IComposition> {
        return new Promise<IComposition>((resolve, reject) => {
            this.db.get("SELECT data from composition_json_table WHERE id=?", [compositionId], function (err, row) {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(row.data));
                }
            });
        });
    }

    saveComposition(compositionId: string, composition: IComposition): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let data = JSON.stringify(composition);
            let query = "INSERT INTO composition_json_table (id, data) VALUES (?,?) ON DUPLICATE KEY UPDATE data=?";
            this.db.run(query, [compositionId, data, data], function (err, row) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

}