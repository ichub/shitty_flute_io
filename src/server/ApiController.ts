/**
 * Created by bgu on 7/14/17.
 */

import * as express from "express";
import * as path from "path";
import {generateToken} from "./ComposerTokenLoader";
import {IDataLayer} from "./IDataLayer";

export const ApiController = express.Router();
export const rootPath = path.join(__dirname, "../../");
// export const dataLayer: IDataLayer = new MockDataLayer();

ApiController.get("/composer", (req: express.Request, res: express.Response) => {
    let token = generateToken();
    res.redirect(302, "/composer/" + token)
});

ApiController.get("/composer/:compositionId", (req: express.Request, res: express.Response) => {

});

ApiController.post("/composer/:compositionId", (req: express.Request, res: express.Response) => {
    let body = req.body;
    // how do you populate the body with the things in UI?
    res.json(req.body)
});

ApiController.get("/composer/:compositionId/data", (req: express.Request, res: express.Response) => {
    res.json();
});