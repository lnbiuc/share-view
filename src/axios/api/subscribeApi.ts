import axios from '../index';

export const subscribeAuthorByAuthorId = async (toAuthorId: string) => {
    return axios({
        url: '../api/publish/subscribe/' + toAuthorId,
        method: 'POST',
    });
};

export const subscribeQuestionById = async (questionId: string) => {
    return axios({
        url: '../api/publish/subscribe/question/' + questionId,
        method: 'POST',
    });
};

export const refreshSubscribe = async (type: string, id: string) => {
    return axios({
        url: '../api/publish/subscribe/refresh',
        method: 'POST',
        data: {
            type: type,
            id: id,
        },
    });
};
