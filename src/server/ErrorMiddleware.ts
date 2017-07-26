import * as express from "express";
import {ReactPage} from "./ReactPageRenderMiddleware";
import {IS_PROD} from "./Env";

export function ErrorMiddleware(err: Error, req: express.Request, res: express.Response, next: express.Handler) {
    const code = (err as any).code || 500;
    const message = IS_PROD ? "looks like there was an error" : err.message || err;

    console.log("error handler invoked");
    console.log(err);

    res.status(code);
    res.render("index", {
        pageName: ReactPage.Error,
        isProd: IS_PROD,
        error: {
            code: code,
            message: message
        }
    });
}