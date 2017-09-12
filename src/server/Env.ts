import * as path from "path";

export const DEBUG_PORT = 4000;
export const PROD_PORT = 80;
export const IS_PROD = (process.env as any).NODE_ENV === "production";
export const PORT = IS_PROD ? PROD_PORT : DEBUG_PORT;
export const rootPath = path.join(__dirname, "../../");
