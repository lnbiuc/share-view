import { format } from 'timeago.js';
import { uploadImage } from '../axios/api/fileApi';
import { ElMessage } from 'element-plus';
import { useDialogControlStore, useThemeStore, useUserInfoLiteStore, useUserStore } from '../pinia';
import { Router } from 'vue-router';
import { storeToRefs } from 'pinia';
import { UserProfileEntity } from '../axios/api/userApi';
import { watch } from 'vue';
import { useDark, useStorage, useToggle } from '@vueuse/core';

export const formatTime = (data: string) => {
    return format(data, 'zh_CN');
};

export const formatDate = (date: any | object) => {
    let mouth;
    let day;
    if (date.getMonth() + 1 < 10) {
        mouth = '0' + (date.getMonth() + 1);
    } else {
        mouth = date.getMonth() + 1;
    }
    if (date.getDate() < 10) {
        day = '0' + date.getDate();
    } else {
        day = date.getDate();
    }
    return date.getFullYear() + '-' + mouth + '-' + day;
};
export const handleUploadImage = async (files: any, callback: any) => {
    const res = await Promise.all(
        files.map((files: any) => {
            return new Promise((rev, rej) => {
                const form = new FormData();
                form.append('file', files);
                uploadImage(files).then((res) => {
                    if (res.data.code == 200) {
                        rev(res);
                        ElMessage.success('image upload success');
                    } else {
                        rej(res);
                        ElMessage.error(res.data.msg);
                    }
                });
            });
        })
    );
    callback(res.map((item) => item.data.data.imgUrl));
};

export const checkLoginStatus = () => {
    const userStore = useUserStore();
    if (userStore.isLogin) {
        return true;
    } else {
        const dialogStore = useDialogControlStore();
        dialogStore.loginForm = true;
        return false;
    }
};

export const tagBgColor = (type: string) => {
    switch (type) {
        case 'Post':
            return '#eebe77';
        case 'Question':
            return '#95d475';
        case 'Article':
            return '#79bbff';
        case 'Video':
            return '#fab6b6';
    }
};

export const toPercent = (num: number) => {
    return Math.min(Math.max(num - 1, 0), 999) / 10;
};

export const handleToArticleDetail = (type: string, articleId: string, router: Router) => {
    switch (type) {
        case 'Article':
            return router.push({ path: '/a/' + articleId });
        case 'Question':
            return router.push({ path: '/q/' + articleId });
        case 'Post':
            return router.push({ path: '/p/' + articleId });
        case 'Video':
            return router.push({ path: '/v/' + articleId });
    }
};

const goArticleAndComment = (articleId: string, title: string, type: string, info: string, router: Router) => {
    handleToArticleDetail(type, articleId, router);
    const dialogStore = useDialogControlStore();
    dialogStore.commentForm.status = true;
    dialogStore.commentForm.data.level = 0;
    dialogStore.commentForm.data.articleId = articleId;
    if (type == 'Post') {
        dialogStore.commentForm.displayInfo = info;
    } else {
        dialogStore.commentForm.displayInfo = title;
    }
};

export const handleClickComment = (articleId: string, title: string, type: string, info: string, router: Router) => {
    const userStore = useUserStore();
    if (userStore.isLogin) {
        goArticleAndComment(articleId, title, type, info, router);
    } else {
        const dialogStore = useDialogControlStore();
        dialogStore.loginForm = true;
        const refUserStore = storeToRefs(userStore);
        const stop = watch(refUserStore.isLogin, () => {
            if (refUserStore.isLogin) {
                goArticleAndComment(articleId, title, type, info, router);
            }
            stop();
        });
    }
};

export const updateUserInfo = (params: UserProfileEntity) => {
    const store = useUserInfoLiteStore();
    store.params.userId = params.userId;
    store.params.username = params.username;
    store.params.signature = params.signature;
    store.params.avatar = params.avatar;
    store.params.level = params.level;
    store.params.registerTime = params.registerTime;
    store.params.ipAddr = params.ipAddr;
};

export const switchTheme = (isEnableDark: boolean) => {
    const theme = useStorage('vueuse-color-scheme', 'light');
    if (isEnableDark) {
        theme.value = 'dark';
    } else {
        theme.value = 'light';
    }
    const themeStore = useThemeStore();
    themeStore.isDark = isEnableDark;
};

export const watchSwitchTheme = () => {
    // Check if the browser supports dark/light mode detection
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        switchTheme(true);
    } else {
        switchTheme(false);
    }

    // Listen for changes in dark/light mode preference
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleModeChange = (e: any) => {
        if (e.matches) {
            switchTheme(true);
        } else {
            switchTheme(false);
        }
    };

    darkModeMediaQuery.addEventListener('change', handleModeChange);
};
