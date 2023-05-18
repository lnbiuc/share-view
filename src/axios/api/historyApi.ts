import axios from '../index';

export const deleteHistoryByArticleId = async (articleId: string) => {
    return axios({
        url: '/api/update/history/delete/' + articleId,
        method: 'DELETE',
    });
};
