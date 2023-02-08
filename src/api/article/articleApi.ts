import axios from 'axios';

interface articleParams {
    pageNumber: number;
    pageSize: number;
    filterBy: filterBy;
    sortBy: sortBy;
}

interface filterBy {
    authorId: string;
    categoryId: number;
    tagId: number;
    type: number;
    startDay: string;
    endDay: string;
}

interface sortBy {
    hot: boolean;
    lastUpdate: boolean;
    like: boolean;
    releaseTime: boolean;
    views: boolean;
}

export function getArticleList(data: articleParams) {
    return axios.post('./api/article/page', data);
}

export function getArticleListBySubscribe(
    userId: string,
    number: number,
    size: number
) {
    return axios({
        url: './api/article/subscribe/' + userId,
        method: 'GET',
        params: {
            pageNumber: number,
            pageSize: size,
        },
    });
}

export function getViewHistory(userId: string, number: number, size: number) {
    return axios({
        url: './api/article/history/' + userId,
        method: 'GET',
        params: {
            pageNumber: number,
            pageSize: size,
        },
    });
}

export function getOneArticle(articleId: string) {
    return axios({
        url: './api/article/' + articleId,
        method: 'GET',
    });
}
