/**
 * Created by bgu on 7/14/17.
 */

import * as express from "express";
import * as path from "path";
import {generateToken} from "./ComposerTokenLoader";
import {htmlDir} from "./Server";
import {SQLiteDataLayer} from "./SQLiteDataLayer";
import {YoutubeApi} from "./YoutubeApi";
import {ICompositionState} from "../models/ICompositionState";
import {InMemoryDataLayer} from "./InMemoryDataLayer";
import {IDataLayer} from "./IDataLayer";

export const ApiController = express.Router();
const fs = require("fs");

// const dataStore = new InMemoryDataLayer();

function returnJson(res: express.Response, promise: Promise<any>): void {
    promise.then(data => res.json(data)).catch(err => {
        res.status(500);
        res.json(err);

        console.log(err);
    });
}

ApiController.get("/", (req: express.Request, res: express.Response) => {
    const fileContents = fs.readFileSync(path.join(htmlDir, "index.html")).toString();
    const initializedState = {
        pageName: "landing",
        viewOnly: true
    };
    res.send(fileContents.replace("\"%INITIALIZE_ME%\"", JSON.stringify(initializedState, null, 2)));
});

// ApiController.get("/all-recordings", (req: express.Request, res: express.Response) => {
//     res.json(dataStore);
// });

ApiController.get("/recorder", (req: express.Request, res: express.Response) => {
    let token = generateToken();
    res.redirect(302, "/recorder/" + token);
});

ApiController.get("/recorder/:editToken", (req: express.Request, res: express.Response) => {
    const fileContents = fs.readFileSync(path.join(htmlDir, "index.html")).toString();

    SQLiteDataLayer
        .getInstance()
        .then((dataLayer: IDataLayer) => {
            dataLayer.createCompositionIfNoneExists(req.params.editToken);
            return Promise.resolve(dataLayer);
        })
        .then((dataLayer: IDataLayer) => {
            return dataLayer.getViewToken(req.params.editToken);
        })
        .then(viewToken => {
            const initializedState = {
                pageName: "recorder",
                editToken: req.params.editToken,
                viewToken: viewToken
            };

            res.send(fileContents.replace("\"%INITIALIZE_ME%\"", JSON.stringify(initializedState, null, 2)));
        });
});

ApiController.get("/recorder/view/:viewToken", (req: express.Request, res: express.Response) => {
    const fileContents = fs.readFileSync(path.join(htmlDir, "index.html")).toString();
    const initializedState = {
        pageName: "recorder-view",
        viewToken: req.params.viewToken
    };

    res.send(fileContents.replace("\"%INITIALIZE_ME%\"", JSON.stringify(initializedState, null, 2)));
});

ApiController.post("/recorder/:editToken/save", (req: express.Request, res: express.Response) => {
    let compositionState = req.body as ICompositionState;
    returnJson(res,
        SQLiteDataLayer
            .getInstance()
            .then((dataLayer) => dataLayer.saveComposition(req.params.editToken, compositionState)));
});

ApiController.get("/recorder/:editToken/data", (req: express.Request, res: express.Response) => {
    returnJson(
        res,
        SQLiteDataLayer
            .getInstance()
            .then((dataLayer) => {
                return dataLayer.getCompositionEdit(req.params.editToken);
            })
    );
});

ApiController.get("/recorder/view/:viewToken/data", (req: express.Request, res: express.Response) => {
    returnJson(
        res,
        SQLiteDataLayer
            .getInstance()
            .then((dataLayer) => {
                return dataLayer.getCompositionView(req.params.viewToken);
            })
    );
});

ApiController.get("/recorder/:editToken/viewToken", (req: express.Request, res: express.Response) => {
    returnJson(
        res,
        SQLiteDataLayer
            .getInstance()
            .then((dataLayer) => {
                return dataLayer.getViewToken(req.params.editToken);
            })
    );
});

ApiController.get("/video-title/:youtubeVideoId", (req: express.Request, res: express.Response) => {
    returnJson(res,
        YoutubeApi.getInfoOnVideo(req.params.youtubeVideoId)
            .then(info => {
                return Promise.resolve({title: info.items[0].snippet.title});
            })
    );
});