import axios from '../index';

export function addCollection(id: string, type: number) {
    return axios({
        url: '../api/publish/collect/' + id,
        method: 'POST',
        params: {
            type: type,
        },
    });
}
