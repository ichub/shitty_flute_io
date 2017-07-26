import * as express from "express";

export function ErrorMiddleware(err: Error, req: express.Request, res: express.Response, next: express.Handler) {
    res.send("looks like there was an error");
}