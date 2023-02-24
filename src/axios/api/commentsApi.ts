import axios from '../index';

export interface PublishCommentsEntity {
    level: number;
    articleId: string;
    content: string;
    toCommentId: number;
}

export function getCommentsById(id: string, num: number, size: number) {
    return axios({
        url: '../api/comment/' + id,
        method: 'GET',
        params: {
            pageNumber: num,
            pageSize: size,
        },
    });
}

export function publishComments(data: PublishCommentsEntity) {
    return axios({
        url: '../api/publish/comment',
        method: 'POST',
        data: data,
    });
}
