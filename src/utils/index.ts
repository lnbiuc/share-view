import { format } from 'timeago.js';
import { uploadFile } from '../axios/api/fileApi';
import { ElMessage } from 'element-plus';

export const formatTime = (data: string) => {
    return format(data, 'zh_CN');
};

export const formatDate = (date: any | object) => {
    let mouth;
    let day;
    if (date.getMonth() + 1 < 10) {
        mouth = '0' + (date.getMonth() + 1);
    } else {
        mouth = date.getMonth() + 1;
    }
    if (date.getDate() < 10) {
        day = '0' + date.getDate();
    } else {
        day = date.getDate();
    }
    return date.getFullYear() + '-' + mouth + '-' + day;
};
export const handleUploadImage = async (files: any, callback: any) => {
    const res = await Promise.all(
        files.map((files: any) => {
            return new Promise((rev, rej) => {
                const form = new FormData();
                form.append('file', files);
                uploadFile(files).then((res) => {
                    if (res.data.code == 200) {
                        rev(res);
                        ElMessage.success('image upload success');
                    } else {
                        rej(res);
                        ElMessage.error(res.data.msg);
                    }
                });
            });
        })
    );

    callback(res.map((item) => item.data.data.imgUrl));
};
