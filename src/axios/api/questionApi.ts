import axios from '../index';

export interface PublishQuestionEntity {
    title: string;
    categoryId: number | undefined;
    content: string;
    tagIds: number[];
}

export const publishQuestion = async (data: PublishQuestionEntity) => {
    return axios({
        url: './api/publish/question',
        method: 'POST',
        data: data,
    });
};

export const publishAnswer = async (toId: string, content: string) => {
    return axios({
        url: '../api/publish/answer',
        method: 'POST',
        data: {
            toId: toId,
            content: content,
        },
    });
};
