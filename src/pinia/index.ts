import { defineStore, storeToRefs } from 'pinia';
import { CountEntity, UserEntity } from '../axios/api/loginApi';
import { formatDate } from '../utils';
import { PublishCommentsEntity } from '../axios/api/commentsApi';
import { CategoryEntity, getCategoryList } from '../axios/api/categoryApi';
import { getAllTags, TagEntity } from '../axios/api/tagApi';
import { ArticleUpdateParams, UserLiteEntity } from '../axios/api/articleApi';
import { UserProfileEntity } from '../axios/api/userApi';

export const useUserStore = defineStore('count', {
    state: () => ({
        user: <UserEntity>{},
        token: <string>'',
        isLogin: <boolean>false,
        count: <CountEntity>{},
    }),
    getters: {
        getUser(state): UserEntity {
            return state.user;
        },
        getToken(state): string {
            return state.token;
        },
        getUserId(state): string {
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
        commentForm: <{ status: boolean; data: PublishCommentsEntity; displayInfo: string }>{
            status: <boolean>false,
            data: {
                level: 0,
                articleId: '',
                content: '',
                toCommentId: 0,
            },
            displayInfo: '',
        },
        publishArticleForm: {
            status: <boolean>false,
        },
        askQuestionForm: {
            status: <boolean>false,
        },
        answerQuestionForm: {
            status: <boolean>false,
        },
        sendPostForm: {
            status: <boolean>false,
        },
        uploadVideoForm: {
            status: <boolean>false,
        },
    }),
});

export const useReloadCommentStore = defineStore('reload-comment', {
    state: () => ({
        reload: <string>'',
        count: <number>0,
    }),
    actions: {
        increase() {
            this.count++;
        },
    },
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
            pageSize: 10,
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
                pageSize: 10,
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
                type: this.params.filterBy.type,
                startDay: '',
                endDay: '',
            };
        },
        resetSort() {
            this.params.sortBy = {
                hot: true,
                releaseTime: false,
                subscribe: false,
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
        filterChangeCategory(categoryId: string) {
            this.resetFilter();
            this.params.filterBy.categoryId = parseInt(categoryId);
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

export const useCategoryAndTagsStore = defineStore('categoryAndTags', {
    state: () => ({
        category: <CategoryEntity[]>[],
        tags: <TagEntity[]>[],
    }),
    actions: {
        refreshCategory() {
            getCategoryList(1, 100).then((res) => {
                this.category = res.data.data.data;
            });
        },
        refreshTags() {
            getAllTags().then((res) => {
                this.tags = res.data.data;
            });
        },
    },
});

export const useUpdateArticleStore = defineStore('updateArticle', {
    state: () => ({
        params: <ArticleUpdateParams>{},
        count: <number>0,
        enable: <boolean>false,
    }),
});

export const useUserSettingStore = defineStore('userSetting', {
    state: () => ({
        params: <UserProfileEntity>{},
    }),
});

export const useUserInfoLiteStore = defineStore('userInfoLite', {
    state: () => ({
        params: <UserLiteEntity>{},
    }),
});

export const useScreenSizeStore = defineStore('screenSize', {
    state: () => ({
        isMobile: <boolean>false,
        isPad: <boolean>false,
        isPC: <boolean>true,
    }),
});
