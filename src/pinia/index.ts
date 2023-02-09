import { defineStore } from 'pinia';

export const useUserStore = defineStore('count', {
    state: () => ({
        user: {},
        token: '',
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
