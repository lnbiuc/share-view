<template>
    <div
        class="flex lg:flex-row flex-col hover:shadow-md shadow-sm transition-all py-2 mt-2 lg:rounded-full bg-white w-auto"
    >
        <div class="flex flex-1 lg:justify-center justify-start">
            <div class="py-2 mx-20 hover:text-purple-600 lg:flex-row flex-col">
                <span class="m-1 cursor-pointer" @click="$router.push({ path: '/' })">Share</span>
            </div>
            <div class="flex flex-1 expand-btn justify-end items-center text-3xl m-auto mr-3">
                <el-dropdown trigger="click" class="mr-6" v-if="store.isLogin">
                    <span class="el-dropdown-link flex flex-row items-center">
                        <el-avatar shape="circle" :src="loginUser.avatar" />
                        <el-icon class="text-lg"><ArrowDown /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>
                                <el-icon>
                                    <User />
                                </el-icon>
                                My Profile
                            </el-dropdown-item>
                            <el-dropdown-item>
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
                <el-icon id="icon" @click="handlerShowNav" class="cursor-pointer hover:text-purple-600">
                    <Fold />
                </el-icon>
            </div>
        </div>
        <div class="flex flex-2 navs lg:justify-center lg:flex-row transition-all lg:mt-0 flex-col">
            <div
                v-for="nav in navs"
                :key="nav.name"
                @click="$router.push({ path: nav.path })"
                class="lg:p-2 p-3 lg:mx-0 mx-40 text-center hover:bg-purple-300 hover:rounded-full transition-all cursor-pointer"
            >
                <span class="m-1">{{ nav.name }}</span>
            </div>
        </div>
        <div class="flex flex-1 justify-center login-btn">
            <div
                class="px-2 py-2 bg-purple-200 hover:bg-purple-300 rounded-full transition-all cursor-pointer"
                @click="dialogStore.loginForm = true"
                v-if="!store.isLogin"
            >
                <span class="m-2">Login / Register</span>
            </div>
            <div class="user" v-if="store.isLogin">
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link flex flex-row items-center">
                        <el-avatar shape="circle" :src="loginUser.avatar" />
                        <span class="ml-2 text-md">{{ loginUser.username }}</span
                        >&nbsp;
                        <el-icon class="text-lg"><ArrowDown /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>
                                <el-icon>
                                    <User />
                                </el-icon>
                                My Profile
                            </el-dropdown-item>
                            <el-dropdown-item>
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
        </div>
    </div>
    <LoginForm />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { userEntity } from '../../../api/login/loginApi';
import { useDialogControlStore, useUserStore } from '../../../pinia';
import { ElMessage } from 'element-plus';
// @ts-ignore
import { InfoFilled, Remove, Setting, User, ArrowDown, Lock, CircleCheck, Fold } from '@element-plus/icons-vue';

const dialogStore = useDialogControlStore();

const showNav = ref<boolean>(false);
const handlerShowNav = () => {
    showNav.value = !showNav.value;
    const el = document.getElementsByClassName('navs')[0];
    const icon = document.getElementById('icon');
    const loginBtn = document.getElementsByClassName('login-btn')[0];
    if (showNav.value) {
        // @ts-ignore
        el.style.display = 'flex';
        // @ts-ignore
        icon.classList.add('menu');
        // @ts-ignore
        loginBtn.style.display = 'flex';
    } else {
        // @ts-ignore
        el.style.display = 'none';
        // @ts-ignore
        icon.classList.remove('menu');
        // @ts-ignore
        loginBtn.style.display = 'none';
    }
};
// navs
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

const loginUser = ref<userEntity>({
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
    const localUser = window.localStorage.getItem('user');
    const sessionUser = window.sessionStorage.getItem('user');
    const localToken = window.localStorage.getItem('token');
    const sessionToken = window.sessionStorage.getItem('token');
    if (localUser && localUser !== '' && localToken && localToken !== '') {
        loginUser.value = JSON.parse(localUser);
        store.isLogin = true;
        store.user = JSON.parse(localUser);
        store.token = localToken;
        store.isLogin = true;
        return;
    } else if (sessionUser && sessionUser !== '' && sessionToken && sessionToken !== '') {
        loginUser.value = JSON.parse(sessionUser);
        store.isLogin = true;
        store.user = JSON.parse(sessionUser);
        store.token = sessionToken;
        store.isLogin = true;
    }
});
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
