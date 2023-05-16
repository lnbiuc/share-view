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
