import axios from 'axios';
import { ElMessage } from 'element-plus';
// @ts-ignore
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const isProduction = process.env.NODE_ENV === 'production';

const baseURL = isProduction ? 'https://share.vio.vin' : process.env.BASE_URL;

const apiAxios = axios.create({
    baseURL,
    withCredentials: true,
});

if (!isProduction) {
    const apiProxy = process.env.API_PROXY;
    apiAxios.interceptors.request.use((config) => {
        if (config.url?.startsWith('/api')) {
            config.url = `${apiProxy}${config.url}`;
        }
        return config;
    });
}

NProgress.configure({
    showSpinner: false,
    minimum: 0.2,
    easeing: 'swing',
    speed: 500,
    trickleRate: 0.2,
});

//前置拦截
apiAxios.interceptors.request.use((config) => {
    NProgress.start();
    return config;
});

//后置拦截
apiAxios.interceptors.response.use((response) => {
    if (response.data.code == 200) {
        NProgress.done();
        return response;
    } else {
        // show when dev
        ElMessage.error(JSON.stringify(response.data));
    }
    NProgress.done();
    return response;
});

export default apiAxios;
