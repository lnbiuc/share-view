import { defineStore } from 'pinia';
import { CountEntity, UserEntity } from '../api/login/loginApi';

export const useUserStore = defineStore('count', {
    state: () => ({
        user: <UserEntity>{},
        token: <string>'',
        isLogin: <boolean>false,
        count: <CountEntity>{},
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
            this.$state.count = {
                publish: 0,
                collection: 0,
                like: 0,
            };
        },
    },
});

export const useDialogControlStore = defineStore('dialog', {
    state: () => ({
        loginForm: <boolean>false,
    }),
});

export const useComponentsDisplayControlStore = defineStore('component-display', {
    state: () => ({
        viewHistoryDisplay: <boolean>false,
    }),
});

export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDark: <boolean>false,
    }),
    getters: {
        get(state) {
            return state.isDark;
        },
    },
    actions: {
        set(val: boolean) {
            this.$state.isDark = val;
        },
    },
});
