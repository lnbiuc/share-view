import axios from '../index';

export const uploadImage = async (file: any) => {
    let formData = new FormData();
    formData.append('img', file);
    return axios({
        url: '/api/file/img',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const uploadVideo = async (file: any) => {
    let formData = new FormData();
    formData.append('video', file);
    return axios({
        url: '/api/file/video',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
