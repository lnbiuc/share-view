import axios from '../index';

export interface SubscribedUserEntity {
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

export const subscribeAuthorByAuthorId = async (toAuthorId: string) => {
    return axios({
        url: '/api/publish/subscribe/' + toAuthorId,
        method: 'POST',
    });
};

export const subscribeQuestionById = async (questionId: string) => {
    return axios({
        url: '/api/publish/subscribe/question/' + questionId,
        method: 'POST',
    });
};

export const refreshSubscribe = async (userId: string, articleId: string, type: number) => {
    return axios({
        url: '/api/publish/subscribe/refresh',
        method: 'POST',
        data: {
            userId: userId,
            articleId: articleId,
            type: type,
        },
    });
};

export const cancelSubscribe = async (userId: string, articleId: string, type: number) => {
    return axios({
        url: '/api/publish/subscribe/cancel',
        method: 'DELETE',
        data: {
            userId: userId,
            articleId: articleId,
            type: type,
        },
    });
};

export const getMySubscribedUser = async (pageNumber: number, pageSize: number, userId: string) => {
    return axios({
        url: '/api/subscribe/all',
        method: 'GET',
        params: {
            pageNumber: pageNumber,
            pageSize: pageSize,
            userId: userId,
        },
    });
};
