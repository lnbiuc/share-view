import axios from '../index';

export function likeArticle(id: string, type: number, isLike: number) {
    return axios({
        url: '../api/publish/like/' + id,
        method: 'POST',
        params: {
            type: type,
            isLike: isLike,
        },
    });
}
