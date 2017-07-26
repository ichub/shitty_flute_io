import * as express from "express";
import {generateToken} from "./ComposerTokenLoader";
import {SQLiteDataLayer} from "./SQLiteDataLayer";
import {YoutubeApi} from "./YoutubeApi";
import {ICompositionState} from "../models/ICompositionState";
import {IDataLayer} from "./IDataLayer";
import {ReactPage} from "./ReactPageRenderMiddleware";

export const ApiController = express.Router();
const fs = require("fs");

// const dataStore = new InMemoryDataLayer();

function returnJson(res: express.Response, promise: Promise<any>): void {
    promise
        .then(data => res.json(data))
        .catch(err => {
            res.status(500);
            res.json(err);

            console.log(err);
        });
}

ApiController.get("/", (req: express.Request, res: express.Response) => {
    res.render("index", {
        pageName: ReactPage.Landing
    });
});

// ApiController.get("/all-recordings", (req: express.Request, res: express.Response) => {
//     res.json(dataStore);
// });

ApiController.get("/recorder", (req: express.Request, res: express.Response, next: Function) => {
    let editToken = generateToken();
    SQLiteDataLayer
        .getInstance()
        .then((dataLayer: IDataLayer) => {
            return dataLayer.createCompositionIfNoneExists(editToken);
        })
        .then(() => res.redirect(302, "/recorder/" + editToken))
        .catch(err => {
            next(err);
        });
});

ApiController.get("/recorder/:editToken", (req: express.Request, res: express.Response, next: Function) => {
    console.log("retrieving composition with edit token: " + req.params.editToken);

    SQLiteDataLayer
        .getInstance()
        .then((dataLayer: IDataLayer) => {
            return dataLayer.getViewToken(req.params.editToken);
        })
        .then(viewToken => {
            res.render("index", {
                pageName: ReactPage.Recorder,
                editToken: req.params.editToken,
                viewToken: viewToken
            });
        })
        .catch(err => {
            next(err);
        });
});

ApiController.get("/recorder/view/:viewToken", (req: express.Request, res: express.Response, next: Function) => {
    res.render("index", {
        pageName: ReactPage.RecorderView,
        viewToken: req.params.viewToken
    });
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

ApiController.get("/video-title/:youtubeVideoURL", (req: express.Request, res: express.Response) => {
    returnJson(res,
        YoutubeApi.getInfoOnVideo(req.params.youtubeVideoURL)
            .then(info => {
                return Promise.resolve({title: info.items[0].snippet.title});
            })
    );
});

export function cleanDB(): Promise<void> {
    return SQLiteDataLayer
        .getInstance()
        .then((dataLayer) => {
            return dataLayer.cleanUnrecordedCompositions();
        })
        .catch(err => {
            return Promise.reject(err);
        });
}