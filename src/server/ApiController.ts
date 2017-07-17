/**
 * Created by bgu on 7/14/17.
 */

import * as express from "express";
import * as path from "path";
import {generateToken} from "./ComposerTokenLoader";
import {htmlDir} from "./Server";
import {IComposition, makeNewIComposition} from "../models/IComposition";
import {FSDataLayer} from "./FSDataLayer";

export const ApiController = express.Router();
export const rootPath = path.join(__dirname, "../../");
const DATA_LAYER = new FSDataLayer();
const fs = require("fs");
// export const dataLayer: IDataLayer = new MockDataLayer();

ApiController.get("/composer", (req: express.Request, res: express.Response) => {
    let token = generateToken();
    res.redirect(302, "/composer/" + token);
});

ApiController.get("/composer/:compositionId", (req: express.Request, res: express.Response) => {
    const fileContents = fs.readFileSync(path.join(htmlDir, "index.html")).toString();
    const initializedState = {
        pageName: "composer",
        compositionId: req.params.compositionId
    };

    res.send(fileContents.replace("\"%INITIALIZE_ME%\"", JSON.stringify(initializedState, null, 2)));
});

ApiController.post("/composer/:compositionId", (req: express.Request, res: express.Response) => {
    let composition = req.body as IComposition;
    let jsonData = DATA_LAYER.saveComposition(req.params.compositionId, composition);
    res.json(jsonData);
});

ApiController.get("/composer/:compositionId/data", (req: express.Request, res: express.Response) => {
    let jsonData = DATA_LAYER.getComposition(req.params.compositionId);
    res.json(jsonData);
    console.log("loaded data for composition id " + req.params.compositionId);
    console.log(jsonData);
});