import axios from '../index';

export interface SendPostEntity {
    content: string;
    imgList: number[];
}

export function sendPost(data: SendPostEntity) {
    return axios({
        url: './publish/post',
        method: 'POST',
        data: data,
    });
}
