import axios from '../index';
import { UserEntity } from './loginApi';
export interface articleParams {
    pageNumber: number;
    pageSize: number;
    filterBy: filterBy;
    sortBy: sortBy;
}

interface filterBy {
    authorId: string;
    categoryId: number;
    tagId: number;
    type: number;
    startDay: string;
    endDay: string;
}

interface sortBy {
    hot: boolean;
    releaseTime: boolean;
}

export interface ArticleListEntity {
    articleId: string;
    author: UserLiteEntity;
    title: string;
    introduction: string;
    type: string;
    tags: TagEntity[];
    category: string;
    releaseTime: string;
    lastUpdate: string;
    setTop: boolean;
    views: number;
    like: number;
    comments: number;
}

export interface TagEntity {
    tagId: number;
    tagName: string;
}

export interface UserLiteEntity {
    userId: string;
    username: string;
    signature: string;
    avatar: string;
    level: number;
    registerTime: string;
    lastLogin: string;
    ipAddr: string;
}

export interface ArticleEntity {
    articleId: string;
    author: UserEntity;
    title: string;
    introduction: string;
    content: string;
    type: string;
    tags: TagEntity[];
    category: string;
    releaseTime: string;
    lastUpdate: string;
    setTop: boolean;
    views: number;
    like: number;
    comments: number;
}

export interface ArticleContentEntity {
    article: ArticleEntity;
    comments: CommentListEntity;
    author: UserLiteEntity;
}

export interface CommentListEntity {
    pageNumber: number;
    pageSize: number;
    currentSize: number;
    total: number;
    data: any[];
}

export interface ViewHistoryEntity {
    id: number;
    articleId: string;
    title: string;
    introduction: string;
    author: UserLiteEntity;
    time: string;
}

export interface UserLiteEntity {
    userId: string;
    username: string;
    signature: string;
    avatar: string;
    level: number;
    ipAddr: string;
}

export function getArticleList(data: articleParams) {
    return axios.post('./api/article/page', data);
}

export function getArticleListBySubscribe(userId: string, number: number, size: number) {
    return axios({
        url: './api/article/subscribe/' + userId,
        method: 'GET',
        params: {
            pageNumber: number,
            pageSize: size,
        },
    });
}

export function getViewHistory(userId: string, number: number, size: number) {
    return axios({
        url: './api/article/history/' + userId,
        method: 'GET',
        params: {
            pageNumber: number,
            pageSize: size,
        },
    });
}

export function getOneArticle(articleId: string) {
    return axios({
        url: '../api/article/' + articleId,
        method: 'GET',
    });
}
