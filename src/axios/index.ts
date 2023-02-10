import axios from 'axios';
import { ElMessage } from 'element-plus';
// @ts-ignore
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
    showSpinner: false,
    minimum: 0.2,
    easeing: 'swing',
    speed: 500,
    trickleRate: 0.2,
});

//前置拦截
axios.interceptors.request.use((config) => {
    NProgress.start();
    return config;
});

//后置拦截
axios.interceptors.response.use((response) => {
    if (response.data.code == 200) {
        NProgress.done();
        return response;
    } else {
        ElMessage.error(response.data.message);
    }
    NProgress.done();
    return response;
});
