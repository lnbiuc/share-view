<template>
    <WelcomeCard v-if="$route.path === '/i'" />
    <div
        class="text-center flex m-auto flex-row sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl"
        id="articleList"
    >
        <div class="flex flex-col w-8/12" id="scrollContent">
            <SortBy v-if="$route.path !== '/c'" />
            <router-view />
        </div>
        <div class="flex flex-col w-4/12">
            <el-affix :offset="0" target="#scrollContent">
                <UserInfo v-if="store.isLogin" :user="store.user" :count="store.count" />
                <OptionMenu />
                <ViewHistory v-if="showHistory.viewHistoryDisplay && store.isLogin" :history-list="historyList" />
            </el-affix>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import { getViewHistory, ViewHistoryEntity } from '../axios/api/articleApi';
import { useComponentsDisplayControlStore, useUserStore } from '../pinia';
import { storeToRefs } from 'pinia';

const store = useUserStore();
const historyList = ref<ViewHistoryEntity[]>();
const showHistory = useComponentsDisplayControlStore();
const refStore = storeToRefs(store);
const getHistoryList = (number: number, size: number) => {
    getViewHistory(store.getUserId, number, size).then((res) => {
        historyList.value = res.data.data.data;
        if (res.data.data.currentSize > 0) {
            showHistory.viewHistoryDisplay = true;
        }
    });
};

if (refStore.isLogin.value) {
    getHistoryList(1, 5);
}

// watch isLogin.value change to control viewHistory components display
watch(refStore.isLogin, async () => {
    // if logged, get view history and display
    if (refStore.isLogin.value) {
        getHistoryList(1, 5);
    }
    if (!refStore.isLogin.value) {
        showHistory.viewHistoryDisplay = false;
    }
});
</script>
