import { defineStore } from 'pinia';
import { userEntity } from '../api/login/loginApi';

export const useUserStore = defineStore('count', {
    state: () => ({
        user: <userEntity>{},
        token: <string>'',
        isLogin: <boolean>false,
    }),
    getters: {
        getUser(state) {
            return state.user;
        },
        getToken(state) {
            return state.token;
        },
        getUserId(state) {
            // @ts-ignore
            return state.user.userId;
        },
    },
    actions: {
        cleanUserStore() {
            this.$state.user = {
                userId: '',
                username: '',
                phone: '',
                mail: '',
                signature: '',
                avatar: '',
                level: 0,
                isBlock: false,
                permissionLevel: 0,
                registerTime: '',
                isMailNotice: false,
                isPhoneNotice: false,
                theme: '',
                lastLogin: '',
                loginIp: '',
                ipAddr: '',
            };
            this.$state.isLogin = false;
            this.$state.token = '';
        },
    },
});
