import {IDataLayer} from "./IDataLayer";
import {IComposition, makeNewIComposition} from "../models/IComposition";
import {rootPath} from "./Server";
import * as path from "path";

/**
 * Created by bgu on 7/16/17.
 */

const fs = require("fs");

export class FSDataLayer implements IDataLayer {
    getDataLayer(): Promise<IDataLayer> {
        return undefined;
    }

    getComposition(compositionId: string): IComposition {
        let readPath = path.join(rootPath, "data", compositionId);
        let jsonData = JSON.parse(fs.readFileSync(readPath).toString());
        return jsonData as IComposition;
    }

    saveComposition(compositionId: string, composition: IComposition): IComposition {
        let data = JSON.stringify(composition);
        let writePath = rootPath + "data/" + compositionId;
        fs.writeFile(writePath, data, function (err) {
            if (err) {
                console.log("Unable to save file. Error: " + err);
            } else {
                console.log("Data saved to path: " + writePath);
            }
        });
        return composition;
    }
}