/**
 * Created by bgu on 7/14/17.
 */

import * as express from "express";
import * as path from "path";
import {generateToken} from "./ComposerTokenLoader";
import {htmlDir} from "./Server";
import {IComposition} from "../models/IComposition";
import {SQLiteDataLayer} from "./SQLiteDataLayer";
import {YoutubeApi} from "./YoutubeApi";

export const ApiController = express.Router();
export const rootPath = path.join(__dirname, "../../");
const fs = require("fs");
// export const dataLayer: IDataLayer = new MockDataLayer();

function returnJson(res: express.Response, promise: Promise<any>): void {
    promise.then(data => res.json(data)).catch(err => {
        res.status(500);
        res.json(err);

        console.log(err);
    });
}

ApiController.get("/composer", (req: express.Request, res: express.Response) => {
    let token = generateToken();
    res.redirect(302, "/composer/" + token);
});

ApiController.get("/composer/:compositionId", (req: express.Request, res: express.Response) => {
    const fileContents = fs.readFileSync(path.join(htmlDir, "index.html")).toString();
    const initializedState = {
        pageName: "composer",
        compositionId: req.params.compositionId,
    };

    res.send(fileContents.replace("\"%INITIALIZE_ME%\"", JSON.stringify(initializedState, null, 2)));
});

ApiController.get("/composer/view/:viewToken", (req: express.Request, res: express.Response) => {
    const fileContents = fs.readFileSync(path.join(htmlDir, "index.html")).toString();
    const initializedState = {
        pageName: "composer-view",
        viewToken: req.params.viewToken,
    };

    res.send(fileContents.replace("\"%INITIALIZE_ME%\"", JSON.stringify(initializedState, null, 2)));
});

ApiController.post("/composer/:compositionId", (req: express.Request, res: express.Response) => {
    let composition = req.body as IComposition;
    returnJson(res,
        SQLiteDataLayer
            .getInstance()
            .then((dataLayer) => dataLayer.saveComposition(req.params.compositionId, composition)));
});

ApiController.get("/composer/:compositionId/data", (req: express.Request, res: express.Response) => {
    returnJson(
        res,
        SQLiteDataLayer
            .getInstance()
            .then((dataLayer) => {
                return dataLayer.getCompositionEdit(req.params.compositionId);
            }),
    );
});

ApiController.get("/composer/view/:viewToken/data", (req: express.Request, res: express.Response) => {
    returnJson(
        res,
        SQLiteDataLayer
            .getInstance()
            .then((dataLayer) => {
                return dataLayer.getCompositionView(req.params.viewToken);
            }),
    );
});

ApiController.get("/video-title/:youtubeVideoId", (req: express.Request, res: express.Response) => {
    returnJson(res,
        YoutubeApi.getInfoOnVideo(req.params.youtubeVideoId)
            .then(info => {
                return Promise.resolve({title: info.items[0].snippet.title});
            }));

});