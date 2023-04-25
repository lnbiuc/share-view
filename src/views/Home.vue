<script setup lang="ts">
import { ref, watch } from 'vue';

import { getViewHistory, ViewHistoryEntity } from '../axios/api/articleApi';
import { useComponentsDisplayControlStore, useUserStore } from '../pinia';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';

const store = useUserStore();
const historyList = ref<ViewHistoryEntity[]>([
    {
        articleId: '',
        type: '',
        title: '',
        introduction: '',
        author: {
            userId: '',
            username: '',
            signature: '',
            avatar: '',
            level: 0,
            ipAddr: '',
        },
        time: '2023-04-25 16:36:13',
    },
]);
const showHistory = useComponentsDisplayControlStore();
const refStore = storeToRefs(store);
const getHistoryList = (number: number, size: number) => {
    getViewHistory(store.getUserId, number, size).then((res) => {
        if (res.data.data.currentSize >= 5) {
            historyList.value = res.data.data.data;
            params.value.total = Math.floor(res.data.data.total % 5) * 5;
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

const params = ref<{ pageNumber: number; pageSize: number; total: number }>({ pageNumber: 1, pageSize: 5, total: 0 });
const historyCurrentChange = (pageNumber: number) => {
    params.value.pageNumber = pageNumber;
    getHistoryList(params.value.pageNumber, params.value.pageSize);
};
</script>

<template>
    <WelcomeCard v-if="$route.path === '/i'" />
    <div
        class="text-center flex m-auto flex-row sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl"
        id="articleList"
    >
        <div class="flex flex-col w-8/12" id="scrollContent_0">
            <SortBy v-if="$route.path !== '/c'" />
            <transition name="fade">
                <router-view />
            </transition>
        </div>
        <div class="flex flex-col w-4/12">
            <el-affix :offset="0" target="#scrollContent_0">
                <UserInfo v-if="store.isLogin" :user="store.user" :count="store.count" />
                <OptionMenu />
                <ViewHistory
                    v-if="showHistory.viewHistoryDisplay && store.isLogin"
                    :history-list="historyList ? historyList : []"
                />
                <Pagination
                    :current-page="params.pageNumber"
                    :page-size="params.pageSize"
                    :total="params.total"
                    @numberChange="historyCurrentChange"
                    :hide-on-single-page="true"
                />
            </el-affix>
        </div>
    </div>
</template>
