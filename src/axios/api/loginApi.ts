import axios from '../index';

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

export interface UserEntity {
    userId: string;
    username: string;
    phone: string;
    mail: string;
    signature: string;
    avatar: string;
    level: number;
    isBlock: boolean;
    permissionLevel: number;
    registerTime: string;
    isMailNotice: boolean;
    isPhoneNotice: boolean;
    theme: string;
    lastLogin: string;
    loginIp: string;
    ipAddr: string;
}

export interface CountEntity {
    publish: number;
    collection: number;
    like: number;
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
