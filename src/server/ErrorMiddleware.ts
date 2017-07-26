import * as express from "express";
import {ReactPage} from "./ReactPageRenderMiddleware";

export function ErrorMiddleware(err: Error, req: express.Request, res: express.Response, next: express.Handler) {
    res.render("index", {
        pageName: ReactPage.Error,
        error: {
            code: 500,
            message: "looks like there was an error"
        }
    });

    // res.send("looks like there was an error");
}