import { defineStore, storeToRefs } from 'pinia';
import { CountEntity, UserEntity } from '../axios/api/loginApi';
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
    actions: {
        setDefault() {
            this.filter = 'hot';
            this.sort = 'releaseTime';
        },
    },
});

export const useArticleParamsStore = defineStore('articleParams', {
    state: () => ({
        params: {
            pageNumber: 1,
            pageSize: 5,
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
                subscribe: false,
            },
        },
    }),
    actions: {
        resetAll() {
            this.params = {
                pageNumber: 1,
                pageSize: 5,
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
                    subscribe: false,
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
                hot: true,
                releaseTime: false,
                subscribe: false,
            };
        },
        sortChange(value: string) {
            this.resetSort();
            if (value === 'hot') {
                this.params.sortBy.hot = true;
                this.params.sortBy.releaseTime = false;
                this.params.sortBy.subscribe = false;
            } else if (value === 'new') {
                this.params.sortBy.hot = false;
                this.params.sortBy.releaseTime = true;
                this.params.sortBy.subscribe = false;
            } else if (value === 'subscribed') {
                const userStore = useUserStore();
                // if not login, open login dialog, watch login status, request after finish login
                // else change store and get response
                if (userStore.isLogin == false) {
                    const loginStore = useDialogControlStore();
                    loginStore.loginForm = true;
                    const refUserStore = storeToRefs(userStore);
                    watch(refUserStore.isLogin, () => {
                        if (userStore.isLogin == true) {
                            this.params.sortBy.hot = false;
                            this.params.sortBy.releaseTime = false;
                            this.params.sortBy.subscribe = true;
                        }
                    });
                } else {
                    this.params.sortBy.hot = false;
                    this.params.sortBy.releaseTime = false;
                    this.params.sortBy.subscribe = true;
                }
            }
        },
        filterTypeChange(type: number) {
            this.resetAll();
            this.params.filterBy.type = type;
        },
    },
});
