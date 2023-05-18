import axios from '../index';

export const addCollection = async (id: string, type: number) => {
    return axios({
        url: '/api/publish/collect/' + id,
        method: 'POST',
        params: {
            type: type,
        },
    });
};

export const getUserCollection = async (userId: string, pageNumber: number, pageSize: number) => {
    return axios({
        url: '/api/collect/' + userId,
        method: 'GET',
        params: {
            pageNumber: pageNumber,
            pageSize: pageSize,
        },
    });
};

export const deleteCollectByCollectId = async (articleId: string) => {
    return axios({
        url: '/api/update/collect/delete/' + articleId,
        method: 'DELETE',
    });
};
