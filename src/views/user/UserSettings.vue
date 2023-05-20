<script setup lang="ts">
import UserProfileLayout from '../../layout/UserProfileLayout.vue';
import { useRouteParams } from '@vueuse/router';
import { ref, Ref } from 'vue';
import { getUserProfile, UserProfileEntity } from '../../axios/api/userApi';
import { useUserSettingStore } from '../../pinia';

const userId = useRouteParams<string>('userId');

const user: Ref<UserProfileEntity> = ref({
    userId: 'old',
    username: '',
    phone: '',
    mail: '',
    signature: '',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    level: 0,
    isBlock: false,
    permissionLevel: 0,
    registerTime: '',
    isMailNotice: false,
    isPhoneNotice: false,
    theme: 'auto',
    lastLogin: '',
    ipAddr: '',
});
const userSettingStore = useUserSettingStore();
getUserProfile(userId.value).then((res) => {
    user.value = res.data.data;
    userSettingStore.params = user.value;
});
</script>

<template>
    <user-profile-layout>
        <template #left>
            <el-affix :offset="10" target="#scrollContent_1">
                <div class="dark:bg-dark border-light dark:border-dark px-2 py-4 rounded-md overflow-hidden">
                    <div class="flex flex-row items-center justify-center h-[20px] mb-4">
                        <div class="flex flex-row items-center">
                            <span class="dark:text-dark"> MENU </span>
                        </div>
                    </div>
                    <el-menu default-active="1" id="menu1" class="el-menu-vertical-demo">
                        <el-menu-item index="1" @click="$router.push('/u/s/account/' + userId)">
                            <el-icon><i-ep-user /></el-icon>
                            <template #title>Account</template>
                        </el-menu-item>
                        <el-menu-item index="2" @click="$router.push('/u/s/security/' + userId)">
                            <el-icon><i-ep-key /></el-icon>
                            <template #title>Security</template>
                        </el-menu-item>
                        <el-menu-item index="3" @click="$router.push('/u/s/password/' + userId)">
                            <el-icon><i-ep-lock /></el-icon>
                            <template #title>Password</template>
                        </el-menu-item>
                        <el-menu-item index="4" @click="$router.push('/u/s/other/' + userId)">
                            <el-icon><i-ep-set-up /></el-icon>
                            <template #title>Other</template>
                        </el-menu-item>
                    </el-menu>
                </div>
            </el-affix>
        </template>
        <template #right>
            <div id="scrollContent_1">
                <router-view />
            </div>
        </template>
    </user-profile-layout>
</template>
