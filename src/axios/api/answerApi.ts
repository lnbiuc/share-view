import axios from '../index';
import {UserLiteEntity} from "./articleApi";
import {CommentsEntity} from "./commentsApi";

export interface AnswerAndCommentEntity {
    id: string
    toId: string
    author: UserLiteEntity
    content: string
    releaseTime: string
    lastUpdate: string
    like: number
    dislike: number
    comments: CommentsEntity[]
}

export function getAnswersByArticleId(articleId: string, num: number, size: number, order: string) {
    return axios({
        url: '../api/answer/' + articleId,
        method: 'GET',
        params: {
            pageNumber: num,
            pageSize: size,
            orderBy: order,
        },
    });
}
