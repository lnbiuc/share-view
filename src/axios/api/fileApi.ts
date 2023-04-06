import axios from '../index';

export function uploadImage(file: any) {
    let formData = new FormData();
    formData.append('img', file);
    return axios({
        url: './api/file/img',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

export function uploadVideo(file: any) {
    let formData = new FormData();
    formData.append('video', file);
    return axios({
        url: './api/file/video',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}
