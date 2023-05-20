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
    ipAddr: string;
}

export interface CountEntity {
    publish: number;
    collection: number;
    like: number;
}

export const login = async (data: loginParams) => {
    return axios.post('/api/user/login', data);
};

export const sendCode = async (data: sendCodeParams) => {
    return axios.post('/api/user/code', data);
};

export const register = async (data: registerParams) => {
    return axios.post('/api/user/register', data);
};
