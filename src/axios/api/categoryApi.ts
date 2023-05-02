import axios from '../index';
import { UserLiteEntity } from './articleApi';

export interface CategoryEntity {
    id: number;
    name: string;
    author: UserLiteEntity;
    introduction: string;
    avatar: string;
    createTime: string;
    articleCount: number;
    questionCount: number;
    postCount: number;
    videoCount: number;
}

export const getCategoryList = async (number: number, size: number) => {
    return axios({
        method: 'GET',
        url: '/api/category/get',
        params: {
            pageNumber: number,
            pageSize: size,
        },
    });
};
