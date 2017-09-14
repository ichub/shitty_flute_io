import * as express from "express";
import {generateToken} from "./ComposerTokenLoader";
import {SQLiteDataLayer} from "./SQLiteDataLayer";
import {YoutubeApi} from "./YoutubeApi";
import {ICompositionState} from "../models/ICompositionState";
import {IDataLayer} from "./IDataLayer";
import {ReactPage} from "./ReactPageRenderMiddleware";
import {SlackAPI} from "./SlackAPI";
import {FlootifyQueue} from "./FlootifyQueue";

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

// ApiController.get("/about", (req: express.Request, res: express.Response) => {
//     res.render("index", {
//         pageName: ReactPage.About
//     });
// });

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

ApiController.get("/topten/:timeLimit", (req: express.Request, res: express.Response) => {
    returnJson(
        res,
        SQLiteDataLayer
            .getInstance()
            .then((dataLayer) => {
                return dataLayer.getTop(10, req.params.timeLimit);
            })
    );
});

ApiController.get("/auto-compose", (req: express.Request, res: express.Response, next) => {
    let editToken = generateToken();
    SQLiteDataLayer
        .getInstance()
        .then((dataLayer: IDataLayer) => {
            return dataLayer.createCompositionIfNoneExists(editToken);
        })
        .then(() => res.redirect(302, "/auto-compose/" + editToken))
        .catch(err => {
            next(err);
        });
});

ApiController.get("/auto-compose/:editToken", (req: express.Request, res: express.Response, next) => {
    console.log("retrieving composition with edit token: " + req.params.editToken);

    SQLiteDataLayer
        .getInstance()
        .then((dataLayer: IDataLayer) => {
            return dataLayer.getViewToken(req.params.editToken);
        })
        .then(viewToken => {
            res.render("index", {
                pageName: ReactPage.AutoCompose,
                editToken: req.params.editToken,
                viewToken: viewToken
            });
        })
        .catch(err => {
            next(err);
        });
});

ApiController.get("/flootify/:youtubeId/:viewToken/:editToken", (req: express.Request, res: express.Response) => {
    console.log(`edit token: ${req.params.editToken}`);
    
    returnJson(
        res,
        YoutubeApi.getDurationOnVideo(req.params.youtubeId)
            .then(duration => {
                if (duration > 600) {
                    console.log("Video duration must be under 10 minutes.");
                    return Promise.reject("Video duration must be under 10 minutes.");
                }
            })
            .then(() => {
                // this happens async; we just resolve
                FlootifyQueue.getInstance().flootify(req.params.youtubeId, req.params.editToken, req.params.viewToken);
                return Promise.resolve();
            })
            .catch(async err => {
                await SlackAPI.sendMessageToShittyFluteChannel(`flootified video: https://www.youtube.com/watch?v=${req.params.youtubeId}\n`);
                return Promise.reject(err);
            })
    );
});

ApiController.get("/video-info/:youtubeId", (req: express.Request, res: express.Response) => {
    returnJson(res,
        YoutubeApi.getSnippetAndDetailOnVideo(req.params.youtubeId)
    );
});

ApiController.get("/video-title/:youtubeId", (req: express.Request, res: express.Response) => {
    returnJson(res,
        YoutubeApi.getTitleOnVideo(req.params.youtubeId)
    );
});

ApiController.get("/video-duration/:youtubeId", (req: express.Request, res: express.Response) => {
    returnJson(res,
        YoutubeApi.getDurationOnVideo(req.params.youtubeId)
    );
});

ApiController.get("/video-thumbnail-url/:youtubeId", (req: express.Request, res: express.Response) => {
    returnJson(res,
        YoutubeApi.getThumbnailOnVideo(req.params.youtubeId)
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