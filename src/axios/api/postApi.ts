import axios from '../index';

export interface SendPostEntity {
    content: string;
    imgList: number[];
    categoryId: number | undefined;
}

export const sendPost = async (data: SendPostEntity) => {
    return axios({
        url: './api/publish/post',
        method: 'POST',
        data: data,
    });
}
