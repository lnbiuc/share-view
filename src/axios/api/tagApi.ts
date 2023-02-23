import axios from '../index';

export interface TagEntity {
    tagId: number;
    tagName: string;
}

export function getAllTags() {
    return axios({
        url: './api/tag/get',
        method: 'GET',
    });
}

export function publishTag(tagName: string) {
    let formData = new FormData();
    formData.append('tagName', tagName);
    return axios({
        url: './api/publish/tag',
        method: 'POST',
        data: formData,
    });
}
