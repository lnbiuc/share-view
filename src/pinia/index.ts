import { defineStore } from 'pinia';
import { CountEntity, UserEntity } from '../api/login/loginApi';
import { formatDate } from '../utils';

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
            this.user = {
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
            this.isLogin = false;
            this.token = '';
            this.count = {
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
            this.isDark = val;
        },
    },
});

export const useFilterAndSortStore = defineStore('filterAndStore', {
    state: () => ({
        filter: <string>'hot',
        sort: <string>'releaseTime',
    }),
});

export const useArticleParamsStore = defineStore('articleParams', {
    state: () => ({
        params: {
            pageNumber: 1,
            pageSize: 7,
            filterBy: {
                authorId: '',
                categoryId: 0,
                tagId: 0,
                type: 0,
                startDay: '',
                endDay: '',
            },
            sortBy: {
                hot: false,
                releaseTime: true,
            },
        },
    }),
    actions: {
        resetAll() {
            this.params = {
                pageNumber: 1,
                pageSize: 7,
                filterBy: {
                    authorId: '',
                    categoryId: 0,
                    tagId: 0,
                    type: 0,
                    startDay: '',
                    endDay: '',
                },
                sortBy: {
                    hot: true,
                    releaseTime: false,
                },
            };
        },
        resetFilter() {
            this.params.filterBy = {
                authorId: '',
                categoryId: 0,
                tagId: 0,
                type: 0,
                startDay: '',
                endDay: '',
            };
        },
        filterChange(value: string) {
            this.resetFilter();
            const now = new Date();
            const weak = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
            const mouth = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
            if (value === 'weak') {
                this.params.filterBy.startDay = formatDate(weak);
                this.params.filterBy.endDay = formatDate(now);
            } else if (value === 'mouth') {
                this.params.filterBy.startDay = formatDate(mouth);
                this.params.filterBy.endDay = formatDate(now);
            } else if (value === 'releaseTime') {
                this.params.filterBy.startDay = '';
                this.params.filterBy.endDay = '';
            }
        },
        resetSort() {
            this.params.sortBy = {
                hot: false,
                releaseTime: true,
            };
        },
        sortChange(value: string) {
            this.resetSort();
            if (value === 'hot') {
                this.params.sortBy.hot = true;
                this.params.sortBy.releaseTime = false;
            } else if (value === 'new') {
                this.params.sortBy.hot = false;
                this.params.sortBy.releaseTime = true;
            }
        },
        filterTypeChange(type: number) {
            this.resetAll();
            this.params.filterBy.type = type;
        },
    },
});
