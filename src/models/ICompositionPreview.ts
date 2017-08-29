import {YoutubeApi, IYoutubeThumbnail} from "../server/YoutubeApi";
/**
 * Created by bgu on 8/1/17.
 */

export interface ICompositionPreview {
    viewToken: string,
    compName: string
    videoTitle: string
    author: string
    thumbnail: IYoutubeThumbnail
    viewCount: number
    autoRecorded: boolean
}

export function makeICompositionPreviewPromise(viewToken: string,
                                               compName: string,
                                               author: string,
                                               viewCount: number,
                                               autoRecorded: boolean,
                                               youtubeId: string): Promise<ICompositionPreview> {
    let videoTitle = YoutubeApi.getTitleOnVideo(youtubeId);
    let thumbnail = YoutubeApi.getThumbnailOnVideo(youtubeId);
    return Promise.all([videoTitle, thumbnail]).then((values: any[]) => {
        return Promise.resolve({
            viewToken: viewToken,
            compName: compName,
            videoTitle: values[0],
            author: author,
            thumbnail: values[1],
            viewCount: viewCount,
            autoRecorded: autoRecorded
        });
    });
}