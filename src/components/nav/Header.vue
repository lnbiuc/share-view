<script setup lang="ts">
import { ref, watch } from 'vue';
import { UserEntity } from '../../axios/api/loginApi';
import { useDialogControlStore, useScreenSizeStore, useThemeStore, useUserStore } from '../../pinia';
import { ElMessage } from 'element-plus';
import { Remove, Setting, User, Sunny, Moon } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';
import { useToggle, useStorage, useDark, useWindowSize } from '@vueuse/core';
import AskQuestionForm from '../dialog/AskQuestionForm.vue';
import SendPostForm from '../dialog/SendPostForm.vue';
import { useRouter } from 'vue-router';
import { switchTheme, watchSwitchTheme } from '../../utils';

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
        if (loginUser.value.theme === 'auto') {
            watchSwitchTheme();
        }
    }
});

const isSwitchOpen = ref<boolean>(false);
const themeStore = useThemeStore();
// 获取已经保存的主题
if (localStorage.getItem('vueuse-color-scheme')) {
    const saveTheme = localStorage.getItem('vueuse-color-scheme');
    // 根据已经保存的主题设置按钮开关状态
    themeStore.isDark = saveTheme == 'dark';
    isSwitchOpen.value = themeStore.isDark;
    // store中的数据与当前数据同步
    const refThemeStore = storeToRefs(themeStore);
    watch(refThemeStore.isDark, () => {
        isSwitchOpen.value = themeStore.isDark;
    });
}
onMounted(() => {
    const isDark = useDark({
        storageKey: 'vueuse-color-scheme',
    });
    useToggle(isDark);
});
const switchChange = () => {
    switchTheme(isSwitchOpen.value);
};

const { width, height } = useWindowSize();

const sizeStore = useScreenSizeStore();

watch(width, () => {
    if (width.value <= 576) {
        sizeStore.isMobile = true;
        sizeStore.isPad = false;
        sizeStore.isPC = false;
    } else if (width.value > 576 && width.value <= 992) {
        sizeStore.isMobile = false;
        sizeStore.isPad = true;
        sizeStore.isPC = false;
    } else {
        sizeStore.isMobile = false;
        sizeStore.isPad = false;
        sizeStore.isPC = true;
    }
});

const navOpen = ref(false);
</script>

<template>
    <div class="flex flex-row justify-center h-[60px] bg-light dark:bg-dark" v-if="sizeStore.isPC">
        <div
            @click="$router.push({ path: '/' })"
            class="flex-row w-4/12 dark:text-gray-200 dark:hover:text-blue-500 text-[24px] flex justify-center xl:justify-end lg:justify-end transition-all items-center cursor-pointer hover:text-blue-500"
        >
            Share
        </div>
        <div class="flex justify-center w-4/12">
            <div
                v-for="nav in navs"
                :key="nav.name"
                @click="$router.push({ path: nav.path })"
                class="flex dark:text-gray-200 items-center dark:hover:text-blue-500 dark:border-b-[black] dark:hover:border-blue-500 hover:text-blue-500 hover:border-blue-500 px-1 mx-1 text-center transition-all cursor-pointer"
            >
                <span class="m-1">{{ nav.name }}</span>
            </div>
        </div>
        <div class="flex justify-center xl:justify-start lg:justify-start mr-0 xl:mr-4 lg:mr-4 items-center w-4/12">
            <el-switch
                v-model="isSwitchOpen"
                inline-prompt
                :active-icon="Moon"
                :inactive-icon="Sunny"
                :change="switchChange()"
                style="--el-switch-on-color: #000000; --el-switch-off-color: #c8c8c8"
                class="mr-4"
            />
            <div class="user flex justify-start items-center" v-if="store.isLogin">
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link flex flex-row items-center cursor-pointer">
                        <el-avatar shape="circle" :src="loginUser.avatar" :size="35" />
                        <span class="ml-2 text-base dark:text-gray-300"> {{ loginUser.username }} </span>&nbsp;
                        <el-icon color="gray" class="ml-2">
                            <i-ep-arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="$router.push('/u/p/publish/' + loginUser.userId)">
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
                    size="large"
                    >Login / Register
                </el-button>
            </div>
        </div>
    </div>
    <div
        v-if="sizeStore.isMobile || sizeStore.isPad"
        class="flex flex-row justify-between h-[60px] bg-light dark:bg-dark"
    >
        <div
            @click="$router.push({ path: '/' })"
            class="flex-row dark:text-gray-200 dark:hover:text-blue-500 text-[24px] flex ml-4 transition-all items-center cursor-pointer hover:text-blue-500"
        >
            Share
        </div>
        <div class="flex flex-row justify-start items-center">
            <el-icon @click="navOpen = !navOpen" :size="30" class="mr-4">
                <i-ant-design-menu-fold-outlined />
            </el-icon>
        </div>
    </div>
    <el-drawer v-model="navOpen" :show-close="false" class="drawer" :close-on-press-escape="true" size="200">
        <template #header="{ close, titleId, titleClass }">
            <div @click="navOpen = false" class="flex flex-row items-center">
                <el-icon :size="30">
                    <i-ant-design-close-outlined />
                </el-icon>
                <span class="title text-xl ml-2"> Close </span>
            </div>
        </template>
        <div
            @click="
                $router.push({ path: '/' });
                navOpen = false;
            "
            class="flex-row h-[50px] font-semibold dark:text-gray-200 dark:hover:text-blue-500 text-[24px] flex ml-4 transition-all items-center cursor-pointer hover:text-blue-500"
        >
            Share
        </div>
        <div
            v-for="nav in navs"
            :key="nav.name"
            @click="
                $router.push({ path: nav.path });
                navOpen = false;
            "
            class="flex h-[40px] dark:text-dark text-xl dark:text-gray-200 items-center dark:hover:text-blue-500 dark:border-b-[black] dark:hover:border-blue-500 hover:text-blue-500 hover:border-blue-500 px-1 mx-1 text-center transition-all cursor-pointer"
        >
            <span class="m-1">{{ nav.name }}</span>
        </div>
        <div class="flex flex-col justify-start items-center mt-4">
            <div v-if="store.isLogin">
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link flex flex-row items-center cursor-pointer">
                        <el-avatar shape="circle" :src="loginUser.avatar" :size="35" />
                        <span class="ml-2 text-base dark:text-gray-300"> {{ loginUser.username }} </span>&nbsp;
                        <el-icon color="gray" class="ml-2">
                            <i-ep-arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="$router.push('/u/p/publish/' + loginUser.userId)">
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
            <div class="flex flex-row mt-3 justify-center items-center">
                <el-button
                    plain
                    bg
                    color="#626aef"
                    :dark="themeStore.isDark"
                    round
                    @click="dialogStore.loginForm = true"
                    v-if="!store.isLogin"
                    size="large"
                    >Login / Register
                </el-button>
            </div>
            <div class="flex flex-row justify-center items-center mt-2">
                <el-switch
                    size="large"
                    v-model="isSwitchOpen"
                    inline-prompt
                    :active-icon="Moon"
                    :inactive-icon="Sunny"
                    :change="switchChange()"
                    style="--el-switch-on-color: #000000; --el-switch-off-color: #c8c8c8"
                />
            </div>
        </div>
    </el-drawer>
    <LoginForm />
    <PublishArticleForm />
    <AskQuestionForm />
    <SendPostForm />
    <UploadVideoForm />
</template>

<style>
.el-drawer__header {
    margin-bottom: 0 !important;
}
</style>
