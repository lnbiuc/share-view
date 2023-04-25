import axios from '../index';

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
