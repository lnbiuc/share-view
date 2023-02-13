<template>
    <div class="text-center flex m-auto flex-row">
        <div class="flex flex-col" style="flex: 2">
            <SortBy
                :sortByList="sortByList"
                :filterByList="filterByList"
                @sortBy="sortChange"
                @filterBy="fitterChange"
            />
            <ArticleCardIndex :articleList="articleList" />
        </div>
        <div class="flex flex-col" style="flex: 1">
            <UserInfo v-if="store.isLogin" />
            <OptionMenu />
            <ViewHistory v-if="showHistory.viewHistoryDisplay && store.isLogin" :history-list="historyList" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ArticleCardIndex from '../components/index/ArticleCardIndex.vue';
import SortBy from '../components/index/nav/SortBy.vue';
import {
    ArticleListEntity,
    getArticleList,
    getArticleListBySubscribe,
    getViewHistory, ViewHistoryEntity
} from "../api/article/articleApi";
import { useComponentsDisplayControlStore, useUserStore } from "../pinia";
import { ElMessage } from 'element-plus';
import OptionMenu from '../components/aside/OptionMenu.vue';
import UserInfo from '../components/aside/UserInfo.vue';
import ViewHistory from '../components/aside/ViewHistory.vue';
import { storeToRefs } from 'pinia';

const articleList = ref<ArticleListEntity[]>();
const data = ref({
    pageNumber: 1,
    pageSize: 5,
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
    },
});
getArticleList(data.value).then((res) => {
    articleList.value = res.data.data.data;
});

const sortByList: Array<{ name: string; value: string }> = [
    {
        name: 'Hot',
        value: 'hot',
    },
    {
        name: 'New',
        value: 'new',
    },
    {
        name: 'Subscribed',
        value: 'subscribed',
    },
];

const filterByList: Array<{ name: string; value: string }> = [
    {
        name: 'All Time',
        value: 'releastTime',
    },
    {
        name: 'This Weak',
        value: 'weak',
    },
    {
        name: 'This Mouth',
        value: 'mouth',
    },
];

const cleanData = () => {
    data.value = {
        pageNumber: 1,
        pageSize: 5,
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
        },
    };
};

const sortChange = (value: string) => {
    if (value === 'hot') {
        data.value.sortBy.hot = true;
        data.value.sortBy.releaseTime = false;
    } else if (value === 'new') {
        data.value.sortBy.hot = false;
        data.value.sortBy.releaseTime = true;
    } else if (value === 'subscribed') {
        const store = useUserStore();
        if (store.getUser) {
            getArticleListBySubscribe(store.getUserId, 1, 10).then((res) => {
                articleList.value = res.data.data.data;
            });
        } else {
            ElMessage.warning('not login');
        }
        return;
    }
    getArticleList(data.value).then((res) => {
        articleList.value = res.data.data.data;
    });
};

const formatDate = (date: object) => {
    let mouth;
    let day;
    // @ts-ignore
    if (date.getMonth() + 1 < 10) {
        // @ts-ignore
        mouth = '0' + (date.getMonth() + 1);
    } else {
        // @ts-ignore
        mouth = date.getMonth() + 1;
    }
    // @ts-ignore
    if (date.getDate() < 10) {
        // @ts-ignore
        day = '0' + date.getDate();
    } else {
        // @ts-ignore
        day = date.getDate();
    }
    // @ts-ignore
    return date.getFullYear() + '-' + mouth + '-' + day;
};

const fitterChange = (value: string) => {
    cleanData();
    const now = new Date();
    const weak = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    const mouth = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
    if (value === 'weak') {
        data.value.filterBy.startDay = formatDate(weak);
        data.value.filterBy.endDay = formatDate(now);
    } else if (value === 'mouth') {
        data.value.filterBy.startDay = formatDate(mouth);
        data.value.filterBy.endDay = formatDate(now);
    } else if (value === 'releaseTime') {
        data.value.filterBy.startDay = '';
        data.value.filterBy.endDay = '';
    }
    getArticleList(data.value).then((res) => {
        articleList.value = res.data.data.data;
    });
};
const store = useUserStore();
const historyList = ref<ViewHistoryEntity[]>();
const showHistory = useComponentsDisplayControlStore()
const refStore = storeToRefs(store);

const getHistoryList = (number:number, size: number) => {
    getViewHistory(store.getUserId, number, size).then((res) => {
        historyList.value = res.data.data.data;
        if (res.data.data.currentSize > 0) {
            showHistory.viewHistoryDisplay = true;
        }
    });
}

if (refStore.isLogin.value) {
    getHistoryList(1, 5)
}

// watch isLogin.value change to control viewHistory components display
watch(refStore.isLogin, async () => {
    // if logged, get view history and display
    if (refStore.isLogin.value) {
        getHistoryList(1, 5)
    }
    if (!refStore.isLogin.value) {
        showHistory.viewHistoryDisplay = false;
    }
});
</script>
