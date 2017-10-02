import {ICompositionState} from "../models/ICompositionState";
import {SQLiteDataLayer} from "./SQLiteDataLayer";
import {SlackAPI} from "./SlackAPI";

export class FlootifyQueue {
    private static instance;

    private queue: Array<{id: string, generator: () => void}> = [];
    private flootifying: Set<{id: string, generator: () => void}> = new Set();

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
            let me = {
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
                        this.flootifying.delete(me);
                        let next = this.queue.shift();
                        if (!(next == null)) {
                            this.flootifying.add(next);
                            next.generator();
                        }
                        this.printQueue();
                    } catch (e) {
                        reject(e);
                    }
                },
                id: youtubeId
            };

            if (this.flootifying.size < 15) {
                this.flootifying.add(me);
                me.generator();
            } else {
                this.queue.push(me);
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
        let resultQueue = "[";

        this.queue.forEach(item => resultQueue += " " + item.id);

        resultQueue += " ]";

        console.log(resultQueue);

        console.log(`flootifying already: ${this.flootifying.size}`);
        let resultSet = "[";
        this.flootifying.forEach(item => resultSet += " " + item.id);
        resultSet += " ]";
        console.log(resultSet);
    }
}