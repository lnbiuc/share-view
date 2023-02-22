import axios from '../index';

export function getAnswersByArticleId(articleId: string, num: number, size: number, order: string) {
    return axios({
        url: '../api/answer/' + articleId,
        method: 'GET',
        params: {
            pageNumber: num,
            pageSize: size,
            orderBy: order,
        },
    });
}
