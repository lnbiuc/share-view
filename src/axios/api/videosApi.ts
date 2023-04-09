import axios from '../index';

export interface publishVideosParams {
    videoId: string;
    url: string;
    preview: string;
    title: string;
    introduction: string;
    categoryId: number | undefined;
    tagIds: number[];
}

export const publishVideo = (params: publishVideosParams) => {
    return axios({
        url: 'api/publish/video',
        method: 'POST',
        data: params,
    });
};
