import axios from '../index';

export function uploadFile(file: any) {
    let formData = new FormData();
    formData.append('img', file);
    return axios({
        url: './api/file/img',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}
