<script setup lang="ts">
import UserCenterLayout from '../../layout/UserCenterLayout.vue';
import { getUserInfo } from '../../axios/api/userApi';
import { useRouteParams } from '@vueuse/router';
import { Ref, ref } from 'vue';
import { UserLiteEntity } from '../../axios/api/articleApi';
import { formatTime, toPercent } from '../../utils';
import { useUserInfoLiteStore } from '../../pinia';
import { storeToRefs } from 'pinia';

const user: Ref<UserLiteEntity> = ref({
    userId: '',
    username: '',
    signature: '',
    avatar: '',
    level: 0,
    registerTime: '',
    lastLogin: '',
    ipAddr: '',
    isSubscribed: false,
});

const userId = useRouteParams<string>('userId');
const userInfoLiteStore = useUserInfoLiteStore();
getUserInfo(userId.value).then((res) => {
    user.value = res.data.data;
    userInfoLiteStore.params = user.value;
});

onMounted(() => {
    const refStore = storeToRefs(userInfoLiteStore);
    watch(refStore.params, () => {
        user.value = refStore.params.value;
    });
});
</script>

<template>
    <user-center-layout>
        <template #avatar>
            <div class="avatar">
                <div
                    :style="{
                        backgroundImage: 'url(' + user.avatar + ')',
                        background: 'center center / no-repeat',
                    }"
                    class="bg-cover bg-center h-[100px] w-[100px] md:h-[200px] md:w-[200px] xl:h-[200px] xl:w-[200px] lg:h-[200px] lg:w-[200px] rounded"
                ></div>
            </div>
        </template>
        <template #userInfo>
            <div class="mb-2 flex flex-row justify-between">
                <div class="flex flex-row">
                    <span class="text-4xl title flex justify-end dark:text-dark">
                        {{ user.username }}
                    </span>
                    <span class="text-gray-400 flex flex-col items-end justify-end mb-1 ml-1">
                        @{{ user.userId }}
                    </span>
                </div>
                <div class="flex flex-col justify-end">
                    <subscribe-btn :is-subscribed="user.isSubscribed" :user-id="user.userId" type="user" />
                </div>
            </div>
            <div class="user-info-signature dark:text-dark">
                {{ user.signature }}
            </div>
            <div class="mt-2 flex flex-row flex-wrap">
                <el-tooltip :content="user.registerTime">
                    <span class="text-gray-400 text-sm"> Register : {{ formatTime(user.registerTime) }} </span>
                </el-tooltip>
                <span class="text-gray-400 mx-1"> · </span>
                <el-tooltip :content="user.lastLogin">
                    <span class="text-gray-400 text-sm"> Last Login : {{ formatTime(user.lastLogin) }} </span>
                </el-tooltip>
                <span class="text-gray-400 mx-1"> · </span>
                <span class="text-gray-400 text-sm">IP form : {{ user.ipAddr }}</span>
            </div>
            <div class="mt-2 flex flex-col">
                <el-progress :percentage="toPercent(user.level)" :text-inside="true" />
                <div class="flex flex-row justify-between mt-1">
                    <span class="text-gray-400 text-xs">Level : {{ Math.floor(toPercent(user.level)) }}</span>
                    <span class="text-gray-400 text-xs">Next : {{ Math.floor(toPercent(user.level)) + 1 }}</span>
                </div>
            </div>
        </template>
        <template #other>
            <router-view />
        </template>
    </user-center-layout>
</template>
