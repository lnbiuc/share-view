<template>
    <div class="flex flex-row h-[60px] bg-light dark:bg-dark bg-light">
        <div
            @click="$router.push({ path: '/' })"
            class="w-3/12 dark:text-gray-200 dark:hover:text-blue-500 text-[24px] flex justify-end transition-all items-center cursor-pointer hover:text-blue-500"
        >
            Share
        </div>
        <div class="flex justify-start w-5/12 ml-10">
            <div
                v-for="nav in navs"
                :key="nav.name"
                @click="$router.push({ path: nav.path })"
                class="flex dark:text-gray-200 items-center dark:hover:text-blue-500 dark:border-b-[black] dark:hover:border-blue-500 hover:text-blue-500 hover:border-blue-500 px-1 mx-1 text-center transition-all cursor-pointer"
            >
                <span class="m-1">{{ nav.name }}</span>
            </div>
        </div>
        <div class="flex justify-end items-center w-1/12 mr-5">
            <el-switch
                v-model="isSwitchOpen"
                inline-prompt
                :active-icon="Moon"
                :inactive-icon="Sunny"
                :change="switchChange()"
                style="--el-switch-on-color: #000000; --el-switch-off-color: #aaaaaa"
            />
        </div>
        <div class="user flex w-3/12 justify-start items-center" v-if="store.isLogin">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link flex flex-row items-center cursor-pointer">
                    <el-avatar shape="circle" :src="loginUser.avatar" />
                    <span class="ml-2 text-xl dark:text-gray-300">{{ loginUser.username }}</span
                    >&nbsp;
                    <el-icon color="gray" class="ml-2 text-xl">
                        <i-ep-arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="$router.push('/u/p/' + loginUser.userId)">
                            <el-icon>
                                <User />
                            </el-icon>
                            My Profile
                        </el-dropdown-item>
                        <el-dropdown-item @click="$router.push('/u/s/' + loginUser.userId)">
                            <el-icon>
                                <Setting />
                            </el-icon>
                            Settings
                        </el-dropdown-item>
                        <el-dropdown-item @click="logout">
                            <el-icon>
                                <Remove />
                            </el-icon>
                            Logout
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="flex justify-center items-center">
            <el-button
                plain
                bg
                color="#626aef"
                :dark="themeStore.isDark"
                round
                @click="dialogStore.loginForm = true"
                v-if="!store.isLogin"
                >Login / Register</el-button
            >
        </div>
    </div>
    <LoginForm />
    <PublishArticleForm />
    <AskQuestionForm />
    <SendPostForm />
    <UploadVideoForm />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { UserEntity } from '../../axios/api/loginApi';
import { useDialogControlStore, useThemeStore, useUserStore } from '../../pinia';
import { ElMessage } from 'element-plus';
// @ts-ignore
import {
    InfoFilled,
    Remove,
    Setting,
    User,
    ArrowDown,
    Lock,
    CircleCheck,
    Fold,
    Sunny,
    Moon,
} from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';
import { useToggle, useStorage, useDark } from '@vueuse/core';
import AskQuestionForm from '../dialog/AskQuestionForm.vue';
import SendPostForm from '../dialog/SendPostForm.vue';

const dialogStore = useDialogControlStore();

const navs = [
    {
        name: 'Article',
        path: '/a',
    },
    {
        name: 'Question',
        path: '/q',
    },
    {
        name: 'Post',
        path: '/p',
    },
    {
        name: 'Video',
        path: '/v',
    },
    {
        name: 'Category',
        path: '/c',
    },
];

const store = useUserStore();

const logout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
    window.sessionStorage.removeItem('token');
    window.sessionStorage.removeItem('user');
    ElMessage.success('logout success');
    store.isLogin = false;
    store.cleanUserStore();
};

const loginUser = ref<UserEntity>({
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
});
// check login status
onMounted(() => {
    // load user info when first enter
    const localUser = window.localStorage.getItem('user');
    const sessionUser = window.sessionStorage.getItem('user');
    const localCount = window.localStorage.getItem('count');
    const sessionCount = window.sessionStorage.getItem('count');
    const localToken = window.localStorage.getItem('token');
    const sessionToken = window.sessionStorage.getItem('token');
    if (localUser && localUser !== '' && localToken && localToken !== '' && localCount && localCount !== '') {
        loginUser.value = JSON.parse(localUser);
        store.user = JSON.parse(localUser);
        store.count = JSON.parse(localCount);
        store.token = localToken;
        store.isLogin = true;
        return;
    } else if (
        sessionUser &&
        sessionUser !== '' &&
        sessionToken &&
        sessionToken !== '' &&
        sessionCount &&
        sessionCount !== ''
    ) {
        loginUser.value = JSON.parse(sessionUser);
        store.user = JSON.parse(sessionUser);
        store.count = JSON.parse(sessionCount);
        store.token = sessionToken;
        store.isLogin = true;
    }
});
// continue watch login status change, change user info when login
const refStore = storeToRefs(store);
watch(refStore.isLogin, async () => {
    if (refStore.isLogin.value) {
        loginUser.value = refStore.user.value;
    }
});
const isSwitchOpen = ref<boolean>(false);
if (localStorage.getItem('vueuse-color-scheme')) {
    const saveTheme = localStorage.getItem('vueuse-color-scheme');
    isSwitchOpen.value = saveTheme == 'dark';
}
const themeStore = useThemeStore();
themeStore.isDark = isSwitchOpen.value;
watch(isSwitchOpen, () => {
    themeStore.isDark = isSwitchOpen.value;
});
const theme = useStorage('vueuse-color-scheme', 'light');

const isDark = useDark({
    storageKey: 'vueuse-color-scheme',
});

onMounted(() => {
    if (isSwitchOpen.value) {
        theme.value = 'dark';
    } else {
        theme.value = 'light';
    }
});
useToggle(isDark);
const switchChange = () => {
    if (isSwitchOpen.value) {
        theme.value = 'dark';
    } else {
        theme.value = 'light';
    }
};
</script>

<style>
@media screen and (max-width: 1440px) {
    .el-dialog {
        width: 40%;
    }
}

@media screen and (max-width: 976px) {
    .el-dialog {
        width: 50%;
    }

    .navs {
        display: none;
    }

    .login-btn {
        display: none;
    }

    .expand-btn {
        display: flex;
    }
}

@media screen and (max-width: 768px) {
    .el-dialog {
        width: 80%;
    }
}
</style>
<style scoped>
.expand-btn {
    display: none;
}

.menu {
    transform: rotate(-90deg);
    transition: all 0.5s ease;
}

#icon {
    transition: all 0.5s ease;
}

@media screen and (max-width: 976px) {
    .login-btn,
    .user,
    .navs {
        display: none;
    }

    .expand-btn {
        display: flex;
    }
}
</style>
