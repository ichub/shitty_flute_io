import {parse, toSeconds, pattern} from "iso8601-duration";

const axios = require("axios");

export class YoutubeApi {
    private constructor() {

    }

    public static getSnippetOnVideo(videoId: string): Promise<IYoutubeVideoSnippet> {
        return axios.get(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=AIzaSyDXOagMe4Ozv3D3iFbtGxSiO4J82IcGXJo`)
            .then((result) => {
                if (result.data.items.length < 1) {
                    return Promise.reject("No video found.");
                }
                return Promise.resolve(result.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }

    public static getDetailOnVideo(videoId: string): Promise<IYoutubeVideoContentDetail> {
        return axios.get(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails,statistics&key=AIzaSyDXOagMe4Ozv3D3iFbtGxSiO4J82IcGXJo`)
            .then((result) => {
                if (result.data.items.length < 1) {
                    return Promise.reject("No video found.");
                }
                return Promise.resolve(result.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }

    public static getSnippetAndDetailOnVideo(videoId: string): Promise<{snippet, detail}> {
        return Promise.all([YoutubeApi.getSnippetOnVideo(videoId), YoutubeApi.getDetailOnVideo(videoId)])
            .then(results => {
                return Promise.resolve({
                    snippet: results[0],
                    detail: results[1],
                });
            });
    }

    public static getTitleOnVideo(videoId: string): Promise<{title: string}> {
        return this.getSnippetOnVideo(videoId)
            .then(info => {
                let title = info.items[0].snippet.title;
                return Promise.resolve({title});
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }

    public static getDurationOnVideo(videoId: string): Promise<number> {
        return this.getDetailOnVideo(videoId)
            .then(info => {
                let duration = toSeconds(parse(info.items[0].contentDetails.duration));
                return Promise.resolve(duration);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }

    public static getThumbnailOnVideo(videoId: string): Promise<IYoutubeThumbnail> {
        return this.getSnippetOnVideo(videoId)
            .then(info => {
                let thumbnailURL = info.items[0].snippet.thumbnails.default.url;
                return Promise.resolve({url: thumbnailURL});
            })
            .catch((err) => {
                return Promise.reject(err);
            });

    }

}

export interface IYoutubeVideoSnippet {
    items: [{
        snippet: {
            title: string
            thumbnails: {
                default: {
                    url: string
                }
            }
        }
    }]
}

export interface IYoutubeVideoContentDetail {
    items: [{
        contentDetails: {
            duration: string
        }
    }]
}

export interface IYoutubeThumbnail {
    url: string
}