import axios from '../index';

export interface UserProfileEntity {
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

export interface UpdateUserProfileEntity {
    userId: string;
    username: string;
    signature: string;
    avatar: string;
    isMailNotice: boolean;
    isPhoneNotice: boolean;
    theme: string;
}

export interface UpdateUserPasswordEntity {
    code: string;
    phone: string;
    email: string;
    password: string;
}

export const getUserInfo = async (userId: string) => {
    return axios({
        url: '/api/user/' + userId,
        method: 'GET',
    });
};

export const getUserProfile = async (userId: string) => {
    return axios({
        url: '/api/user/profile/' + userId,
        method: 'POST',
    });
};

export const updateUserProfile = (params: UpdateUserProfileEntity) => {
    return axios({
        url: '/api/update/user/profile',
        method: 'PUT',
        data: params,
    });
};

export const updateUserAccount = (account: string, code: string) => {
    return axios({
        url: '/api/update/user/account',
        method: 'PUT',
        params: {
            account: account,
            code: code,
        },
    });
};

export const updateUserPassword = (params: UpdateUserPasswordEntity) => {
    return axios({
        url: '/api/update/user/password',
        method: 'PUT',
        data: params,
    });
};
