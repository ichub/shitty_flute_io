const axios = require("axios");

export class YoutubeApi {
    private constructor() {

    }

    public static getInfoOnVideo(videoId: string): Promise<IYoutubeVideoInfo> {
        return axios.get(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=AIzaSyDXOagMe4Ozv3D3iFbtGxSiO4J82IcGXJo`)
            .then((result) => {
                console.log(result.data);
                return Promise.resolve(result.data);
            });
    }
}

export interface IYoutubeVideoInfo {
    items: [{
        snippet: {
            title: string
        }
    }]
}