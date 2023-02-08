import axios from 'axios';

interface loginParams {
    rememberMe: boolean;
    phone: string;
    email: string;
    code: string;
    password: string;
}

interface sendCodeParams {
    phone: string;
    email: string;
}

interface registerParams {
    phone: string;
    email: string;
    code: string;
    password: string;
}

export function login(data: loginParams) {
    return axios.post('/api/user/login', data);
}

export function sendCode(data: sendCodeParams) {
    return axios.post('/api/user/code', data);
}

export function register(data: registerParams) {
    return axios.post('/api/user/register', data);
}
