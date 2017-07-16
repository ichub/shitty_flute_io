import * as express from "express";
import * as path from "path";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import {ApiController} from "./ApiController";
import * as fs from "fs";
import {InitializationState} from "../models/IInitializationState";

export declare var initializedState: InitializationState;


export const rootPath = path.join(__dirname, "../../");
export const htmlDir = path.join(rootPath, "html");
export const jsDir = path.join(rootPath, "dist", "bundle");
export const resDir = path.join(rootPath, "res");
export const cssDir = path.join(rootPath, "css");

const app = express();

export var sqlite3 = require("sqlite3").verbose();
export var db = new sqlite3.Database(":memory:");

app.use(bodyParser.json());
app.use(morgan("dev" as any));

app.use(ApiController);

app.get("/", (req, res) => {
    const fileContents = fs.readFileSync(path.join(htmlDir, "index.html")).toString();
    initializedState = {
        pageName: "landing"
    };
    res.send(fileContents.replace("\"%INITIALIZE_ME%\"", JSON.stringify(initializedState, null, 2)));
});

app.use("/js", express.static(jsDir));
app.use("/res", express.static(resDir));
app.use("/css", express.static(cssDir));

const port = 4000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});