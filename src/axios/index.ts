import axios from 'axios';
import { ElMessage } from 'element-plus';

//前置拦截
axios.interceptors.request.use((config) => {
    return config;
});

//后置拦截
axios.interceptors.response.use((response) => {
    if (response.data.code == 200) {
        return response;
    } else {
        ElMessage.error(response.data.message);
    }
    return response;
});
