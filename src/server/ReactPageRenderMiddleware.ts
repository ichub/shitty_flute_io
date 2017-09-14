import * as express from "express";

export function ReactPageRenderMiddleware(req: express.Request, res: express.Response, next: Function) {
    next();
}

export enum ReactPage {
    Landing = "landing",
    Recorder = "recorder",
    RecorderView = "recorder-view",
    Error = "error",
    AutoCompose = "auto-compose",
    About = "about",
}

declare namespace Express {
    export interface Request {
        tenant?: string
    }
}