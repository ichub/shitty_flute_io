import {ICompositionState} from "../models/ICompositionState";
import {SQLiteDataLayer} from "./SQLiteDataLayer";

export class FlootifyQueue {
    private static instance;

    private queue = [];

    private constructor() {

    }

    public static getInstance(): FlootifyQueue {
        if (!this.instance) {
            this.instance = new FlootifyQueue();
        }

        return this.instance;
    }

    async flootify(youtubeId: string): Promise<ICompositionState> {
        return new Promise<ICompositionState>((resolve, reject) => {
            this.queue.push(async() => {
                try {
                    const dataLayer = await SQLiteDataLayer.getInstance();
                    const result = await dataLayer.flootify(youtubeId);
                    resolve(result);
                    this.queue.shift();
                    console.log(`flootify queue length: ${this.queue.length}`);

                    if (this.queue.length > 0) {
                        this.queue[0]();
                    }
                } catch (e) {
                    reject(e);
                }
            });

            if (this.queue.length === 1) {
                this.queue[0]();
            }

            console.log(`flootify queue length: ${this.queue.length}`);
        });
    }
}