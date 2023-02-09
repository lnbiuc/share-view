import axios from 'axios';

export interface loginParams {
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

export interface userEntity {
    userId: string;
    username: string;
    phone: string;
    mail: string;
    signature: string;
    level: number;
    isBlock: boolean;
    permissionLevel: number;
    register: string;
    isMailNotify: boolean;
    isPhoneNotify: boolean;
    theme: string;
    lastLogin: string;
    loginIp: string;
    ipAddr: string;
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
