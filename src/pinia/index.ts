import { defineStore } from 'pinia';
import { userEntity } from '../api/login/loginApi';

export const useUserStore = defineStore('count', {
    state: () => ({
        user: <userEntity>{},
        token: <string>'',
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
});
