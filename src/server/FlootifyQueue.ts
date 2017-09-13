import {ICompositionState} from "../models/ICompositionState";
import {SQLiteDataLayer} from "./SQLiteDataLayer";
import {SlackAPI} from "./SlackAPI";

export class FlootifyQueue {
    private static instance;

    private queue: Array<{id: string, generator: () => void}> = [];

    private constructor() {

    }

    public static getInstance(): FlootifyQueue {
        if (!this.instance) {
            this.instance = new FlootifyQueue();
        }

        return this.instance;
    }

    async flootify(youtubeId: string, editToken: string, viewToken: string): Promise<ICompositionState> {
        return new Promise<ICompositionState>((resolve, reject) => {
            this.queue.push({
                generator: async() => {
                    try {
                        const startDate = Date.now();

                        let interval = setInterval(() => {
                            const difference = Date.now() - startDate;
                            console.log(`PROCESSING: ${youtubeId}, ${difference / 1000} seconds`);
                        }, 1000 * 5);

                        const dataLayer = await SQLiteDataLayer.getInstance();
                        const result = await dataLayer.flootify(youtubeId, editToken);
                        clearInterval(interval);

                        const difference = Date.now() - startDate;
                        console.log(`FINISHED: ${youtubeId} after ${difference / 1000} seconds`);

                        resolve(result);
                        this.queue.shift();
                        this.printQueue();

                        if (this.queue.length > 0) {
                            this.queue[0].generator();
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                id: youtubeId
            });

            if (this.queue.length === 1) {
                this.queue[0].generator();
            }

            this.printQueue();
        })
            .then(async flootified => {
                await SlackAPI.sendMessageToShittyFluteChannel(
                    `flootified video: https://www.youtube.com/watch?v=${youtubeId}\n` +
                    `watch it here: http://floot.io/recorder/view/${viewToken}`);
                return Promise.resolve(flootified);
            });
    }

    printQueue() {
        console.log(`flootify queue length: ${this.queue.length}`);
        let result = "[";

        this.queue.forEach(item => result += " " + item.id);

        result += " ]";

        console.log(result);
    }
}