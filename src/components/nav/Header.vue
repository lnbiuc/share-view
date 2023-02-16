<template>
    <div class="flex flex-row h-12 bg-white dark:bg-dark bg-light">
        <div
            @click="$router.push({ path: '/' })"
            class="w-3/12 dark:text-gray-200 dark:hover:text-purple-300 text-lg font-bold flex justify-end transition-all items-center cursor-pointer hover:text-purple-400"
        >
            Share
        </div>
        <div class="flex justify-end w-5/12">
            <div
                v-for="nav in navs"
                :key="nav.name"
                @click="$router.push({ path: nav.path })"
                class="flex dark:text-gray-200 dark:hover:text-neutral-800 items-center px-1 mx-1 text-center hover:bg-purple-300 transition-all cursor-pointer"
            >
                <span class="m-1">{{ nav.name }}</span>
            </div>
        </div>
        <div class="flex justify-center items-center w-1/12">
            <el-switch
                v-model="isSwitchOpen"
                inline-prompt
                :active-icon="Moon"
                :inactive-icon="Sunny"
                :change="switchChange()"
                style="--el-switch-on-color: #2a2a2a; --el-switch-off-color: #c7c7c7"
            />
        </div>
        <div class="user flex w-3/12 justify-start items-center" v-if="store.isLogin">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link flex flex-row items-center cursor-pointer">
                    <el-avatar shape="circle" :src="loginUser.avatar" />
                    <span class="ml-2 text-lg dark:text-gray-200">{{ loginUser.username }}</span
                    >&nbsp;
                    <el-icon class="text-lg"><ArrowDown /></el-icon>
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
        <div
            class="px-2 my-2 bg-purple-200 hover:bg-purple-300 flex items-center rounded-full transition-all cursor-pointer"
            @click="dialogStore.loginForm = true"
            v-if="!store.isLogin"
        >
            <span class="m-2">Login / Register</span>
        </div>
    </div>
    <LoginForm />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { UserEntity } from '../../api/login/loginApi';
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
