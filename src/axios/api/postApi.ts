import axios from '../index';

export interface SendPostEntity {
    content: string;
    imgList: number[];
    categoryId: number | null;
}

export function sendPost(data: SendPostEntity) {
    return axios({
        url: './api/publish/post',
        method: 'POST',
        data: data,
    });
}
