import axios from 'axios';
import { ElMessage } from 'element-plus';
// @ts-ignore
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useRouter } from 'vue-router';

const isProduction = process.env.NODE_ENV === 'production';

const baseURL = isProduction ? 'https://share.vio.vin' : process.env.BASE_URL;

const apiAxios = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 10000,
});

apiAxios.defaults.baseURL = baseURL;

NProgress.configure({
    showSpinner: false,
    minimum: 0.2,
    easeing: 'swing',
    speed: 500,
    trickleRate: 0.2,
});

const router = useRouter();

//前置拦截
apiAxios.interceptors.request.use((config) => {
    NProgress.start();
    return config;
});

//后置拦截
apiAxios.interceptors.response.use(
    (response) => {
        NProgress.done();
        if (response.data.code == 200) {
            return response;
        } else {
            // show when dev
            ElMessage.error(response.data.message);
            router.push({ path: '/500' });
        }
        return response;
    },
    (error) => {
        NProgress.done();
        router.push({ path: '/500' });
    }
);

export default apiAxios;
