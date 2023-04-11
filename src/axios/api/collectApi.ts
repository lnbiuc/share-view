import axios from '../index';

export const addCollection = async (id: string, type: number) => {
    return axios({
        url: '../api/publish/collect/' + id,
        method: 'POST',
        params: {
            type: type,
        },
    });
};
