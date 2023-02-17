import axios from 'axios';
import { UserLiteEntity } from '../article/articleApi';

export interface CategoryEntity {
    id: number;
    name: string;
    author: UserLiteEntity;
    introduction: string;
    avatar: string;
    createTime: string;
}

export function getCategoryList(number: number, size: number) {
    return axios({
        method: 'GET',
        url: './api/category/get',
        params: {
            pageNumber: number,
            pageSize: size,
        },
    });
}
