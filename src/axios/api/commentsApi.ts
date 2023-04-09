import axios from '../index';
import { UserLiteEntity } from './articleApi';

export interface PublishCommentsEntity {
    level: number;
    articleId: string;
    content: string;
    toCommentId: number;
}

export interface CommentsEntity {
    pageNumber: number;
    pageSize: number;
    currentSize: number;
    total: number;
    data: CommentEntity[];
}

export interface CommentUserEntity {
    userId: string;
    username: string;
    avatar: string;
    ipAddr: string;
}

export interface CommentToUser {
    userId: string;
    username: string;
}

export interface CommentEntity {
    id: number;
    user: CommentUserEntity;
    content: string;
    createTime: string;
    isLiked: boolean;
    likesCount: number;
    toUser: any;
    childComments: ChildComment[];
}

export interface ChildComment {
    id: number;
    user: CommentUserEntity;
    content: string;
    createTime: string;
    isLiked: boolean;
    likesCount: number;
    toUser: CommentToUser;
    childComments: null;
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
