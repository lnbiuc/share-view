import axios from '../index';

export function subscribeAuthorByAuthorId(toAuthorId: string) {
    return axios({
        url: '../api/publish/subscribe/' + toAuthorId,
        method: 'POST',
    });
}
