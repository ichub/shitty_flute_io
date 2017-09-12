import * as express from "express";
import * as path from "path";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import {ApiController, cleanDB} from "./ApiController";
import * as fs from "fs";
import {InitializationState} from "../models/IInitializationState";
import {ErrorMiddleware} from "./ErrorMiddleware";
import {DEBUG_PORT, PORT, rootPath} from "./Env";
import * as exphbs from "express-handlebars";
import {NoteInfoList} from "../models/NoteInfoList";
import {SlackAPI} from "./SlackAPI";

export declare var initializedState: InitializationState;

export const htmlDir = path.join(rootPath, "html");
export const jsDir = path.join(rootPath, "dist", "bundle");
export const resDir = path.join(rootPath, "res");
export const cssDir = path.join(rootPath, "css");

const app = express();
const schedule = require('node-schedule');

app.use(bodyParser.json({limit: '50mb'}));
app.use(morgan("dev" as any));
app.set('view engine', 'hbs');
app.engine(".hbs", exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: path.join(rootPath, "views", "layouts"),
    helpers: {
        str: (context) => {
            return JSON.stringify(context);
        }
    }
}));

app.use(ApiController);

app.use("/js", express.static(jsDir));
app.use("/res", express.static(resDir));
app.use("/css", express.static(cssDir));

app.use(ErrorMiddleware);

app.listen(PORT, async() => {
    console.log(`listening on port ${PORT}`);

    await SlackAPI.sendMessageToShittyFluteChannel("server starting");
});

// schedule jobs
// clean every day at midnight
schedule.scheduleJob('* 0 * * *', () => {
    console.log("Attempting to clean DB.");
    cleanDB()
        .then(() => console.log("Finished executing clean job."))
        .catch(err => {
            console.log("Could not execute clean job for reason: ");
            console.log(err);
        });
});