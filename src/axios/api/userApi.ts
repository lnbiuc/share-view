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
