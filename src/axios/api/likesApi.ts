import axios from '../index';

export interface UserLikeEntity {
    likeId: number;
    articleId: string;
    executeTime: string;
    article: Article;
}

export interface Article {
    articleId: string;
    author: Author;
    title: string;
    introduction: string;
    type: string;
    tags: Tag[];
    category: string;
    content: any;
    releaseTime: string;
    lastUpdate: string;
    setTop: boolean;
    views: number;
    like: number;
    collect: number;
    comments: number;
    images: any;
}

export interface Author {
    userId: string;
    username: string;
    signature: string;
    avatar: string;
    level: number;
    registerTime: string;
    lastLogin: string;
    ipAddr: string;
    isSubscribed: any;
}

export interface Tag {
    tagId: number;
    tagName: string;
}

export interface LikedCommentEntity {
    likeId: number;
    commentId: number;
    executeTime: string;
    comment: Comment;
}

export interface Comment {
    commentId: number;
    toArticleId: string;
    toArticleTitle: string;
    toUser: ToUser;
    toCommentContent: string;
    content: string;
    level: boolean;
    createTime: string;
}

export interface ToUser {
    userId: string;
    username: string;
    avatar: string;
    ipAddr: string;
}

export const likeArticle = async (id: string, type: number, isLike: number) => {
    return axios({
        url: '/api/publish/like/' + id,
        method: 'POST',
        params: {
            type: type,
            isLike: isLike,
        },
    });
};

export const getLikedArticleByUserId = async (userId: string, pageNumber: number, pageSize: number) => {
    return axios({
        url: '/api/like/a/' + userId,
        method: 'GET',
        params: {
            pageNumber: pageNumber,
            pageSize: pageSize,
        },
    });
};

export const getLikedCommentByUserId = async (userId: string, pageNumber: number, pageSize: number) => {
    return axios({
        url: '/api/like/c/' + userId,
        method: 'GET',
        params: {
            pageNumber: pageNumber,
            pageSize: pageSize,
        },
    });
};

export const getLikedAnswerByUserId = async (userId: string, pageNumber: number, pageSize: number) => {
    return axios({
        url: '/api/like/q/' + userId,
        method: 'GET',
        params: {
            pageNumber: pageNumber,
            pageSize: pageSize,
        },
    });
};
