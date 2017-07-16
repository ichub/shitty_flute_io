/**
 * Created by bgu on 7/14/17.
 */

import * as express from "express";
import * as path from "path";
import {generateToken} from "./ComposerTokenLoader";
import {htmlDir} from "./Server";

export const ApiController = express.Router();
export const rootPath = path.join(__dirname, "../../");
const fs = require("fs");
// export const dataLayer: IDataLayer = new MockDataLayer();

ApiController.get("/composer", (req: express.Request, res: express.Response) => {
    let token = generateToken();
    res.redirect(302, "/composer/" + token);
});

ApiController.get("/composer/:compositionId", (req: express.Request, res: express.Response) => {
    let readPath = rootPath + "data/" + req.params.compositionId;
    let jsonData = JSON.parse("{}");
    fs.readFile(readPath, function (err, data) {
        if (!(err)) {
            jsonData = JSON.parse(data);
        }
    });
    //res.sendFile(path.join(htmlDir, "index.html"));

    const fileContents = fs.readFileSync(path.join(htmlDir, "index.html")).toString();
    const initializedState = {
        pageName: "composer",
    };

    res.send(fileContents.replace("\"%INITIALIZE_ME%\"", JSON.stringify(initializedState, null, 2)));
});

ApiController.post("/composer/:compositionId", (req: express.Request, res: express.Response) => {
    let data = JSON.stringify(req.body);
    let writePath = rootPath + "data/" + req.params.compositionId;
    fs.writeFile(writePath, data, function (err) {
        if (err) {
            console.log("Unable to save file. Error: " + err);
        } else {
            console.log("Data saved to path: " + writePath);
        }
    });
    res.json(req.body);
});

ApiController.get("/composer/:compositionId/data", (req: express.Request, res: express.Response) => {
    res.json();
});