import axios from 'axios';

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
    author: UserEntity;
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

export interface UserEntity {
    userId: string;
    username: string;
    phone: string;
    mail: string;
    signature: string;
    avatar: string;
    level: number;
    isBlock: boolean;
    permissionLevel: number;
    registerTime: string;
    isMailNotice: boolean;
    isPhoneNotice: boolean;
    theme: string;
    lastLogin: string;
    loginIp: string;
    ipAddr: string;
}

export interface Author {
    userId: string;
    username: string;
    phone: string;
    mail: string;
    signature: string;
    avatar?: any;
    level: number;
    isBlock?: any;
    permissionLevel: number;
    registerTime: string;
    isMailNotice?: any;
    isPhoneNotice?: any;
    theme?: any;
    lastLogin: string;
    loginIp: string;
    ipAddr?: any;
}

export interface ArticleEntity {
    articleId: string;
    author: Author;
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

export interface CommentListEntity {
    pageNumber: number;
    pageSize: number;
    currentSize: number;
    total: number;
    data: any[];
}

export interface OneArticleEntity {
    article: ArticleEntity;
    comments: CommentListEntity;
    author: UserEntity;
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
    // @ts-ignore
}
