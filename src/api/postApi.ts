import axios from 'axios';

export function getPostImages(articleId: string, userId: string) {
    return axios({
        url: '../api/post/' + articleId,
        method: 'GET',
        params: {
            userId: userId,
        },
    });
}
