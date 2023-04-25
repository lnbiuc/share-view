import axios from '../index';
import { UserLiteEntity } from './articleApi';

export interface CategoryEntity {
    id: number;
    name: string;
    author: UserLiteEntity;
    introduction: string;
    avatar: string;
    createTime: string;
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
