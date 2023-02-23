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
    return axios({
        url: './api/publish/tag',
        method: 'POST',
        data: {
            tagName: tagName,
        },
    });
}
