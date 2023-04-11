import axios from '../index';

export const getUserInfo = async (userId: string) => {
    return axios({
        url: '../../api/user/' + userId,
        method: 'GET',
    });
};

export const getUserProfile = async (userId: string) => {
    return axios({
        url: 'api/user/profile/' + userId,
        method: 'POST',
    });
};
