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
    collect: number;
    comments: number;
    images: string[];
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
    isSubscribed: boolean;
}

export interface ArticleEntity {
    articleId: string;
    author: UserLiteEntity;
    title: string;
    introduction: string;
    type: string;
    tags: TagEntity[];
    category: string;
    content: string;
    releaseTime: string;
    lastUpdate: string;
    setTop: boolean;
    views: number;
    like: number;
    collect: number;
    comments: number;
    images?: any;
}

export interface ArticleContentEntity {
    article: ArticleEntity;
    comments: CommentListEntity;
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

export function publishArticle(data: {
    title: string;
    introduction: string;
    categoryId: number | undefined;
    content: string;
    tagIds: number[];
}) {
    return axios({
        url: '../api/publish/article',
        method: 'POST',
        data: data,
    });
}
