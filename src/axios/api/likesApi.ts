import axios from '../index';

export const likeArticle = async (id: string, type: number, isLike: number) => {
    return axios({
        url: '/api/publish/like/' + id,
        method: 'POST',
        params: {
            type: type,
            isLike: isLike,
        },
    });
};

export const getLikedArticleByUserId = async (userId: string, pageNumber: number, pageSize: number) => {
    return axios({
        url: '/api/like/a/' + userId,
        method: 'GET',
        params: {
            pageNumber: pageNumber,
            pageSize: pageSize,
        },
    });
};

export const getLikedCommentByUserId = async (userId: string, pageNumber: number, pageSize: number) => {
    return axios({
        url: '/api/like/c/' + userId,
        method: 'GET',
        params: {
            pageNumber: pageNumber,
            pageSize: pageSize,
        },
    });
};

export const getLikedAnswerByUserId = async (userId: string, pageNumber: number, pageSize: number) => {
    return axios({
        url: '/api/like/q/' + userId,
        method: 'GET',
        params: {
            pageNumber: pageNumber,
            pageSize: pageSize,
        },
    });
};
