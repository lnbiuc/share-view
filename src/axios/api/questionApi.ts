import axios from '../index';

export interface PublishQuestionEntity {
    title: string;
    categoryId: number | null;
    content: string;
    tagIds: number[];
}

export function publishQuestion(data: PublishQuestionEntity) {
    return axios({
        url: './api/publish/question',
        method: 'POST',
        data: data,
    });
}
