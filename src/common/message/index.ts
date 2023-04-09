import { ElNotification } from 'element-plus';

export const uploadError = (error: Error) => {
    ElNotification({
        title: 'Error',
        message: error.message,
        type: 'error',
        duration: 0,
    });
};

export const uploadSuccess = (message: string) => {
    ElNotification({
        title: 'Success',
        message: message,
        type: 'success',
    });
};
