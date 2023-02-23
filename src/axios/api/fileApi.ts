import axios from '../index';

export function uploadFile(file: any) {
    let formData = new FormData();
    formData.append('img', file[0]);
    return axios({
        url: './api/file/img',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}
