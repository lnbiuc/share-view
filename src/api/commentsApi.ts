import axios from 'axios';

export function getCommentsById(id: string, num: number, size: number) {
    return axios({
        url: '../api/comment/' + id,
        method: 'GET',
        params: {
            pageNumber: num,
            pageSize: size,
        },
    });
}
