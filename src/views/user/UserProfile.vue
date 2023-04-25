<script setup lang="ts">
import {ref, Ref} from 'vue';
import {
    ArticleListEntity,
    articleParams,
    getArticleList,
    getViewHistory,
    ViewHistoryEntity
} from '../../axios/api/articleApi';
import {useArticleParamsStore, useUserStore} from '../../pinia';
import {storeToRefs} from 'pinia';
import axios from '../../axios';
import {useRouteParams} from '@vueuse/router';
import {ElMain, ElMessage} from "element-plus";

const articleList: Ref<ArticleListEntity[]> = ref([
    {
        articleId: '',
        author: {
            userId: '',
            username: '',
            signature: '',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            level: 0,
            registerTime: '',
            lastLogin: '',
            ipAddr: '',
            isSubscribed: false,
        },
        title: '',
        introduction: '',
        type: '',
        tags: [],
        category: '',
        content: '',
        releaseTime: '',
        lastUpdate: '',
        setTop: false,
        views: 0,
        like: 0,
        collect: 0,
        comments: 0,
        images: [],
    },
]);
const isEmpty = ref<boolean>(false);
watch(articleList, () => {
    isEmpty.value = articleList.value?.length == 0;
});

const getArticleList = async (data: articleParams) => {
    return axios.post('/api/article/page', data);
};

const total = ref(0);
const isLoad = ref<boolean>(true);
const paramsStore = useArticleParamsStore();
paramsStore.filterTypeChange(0);
const userId = useRouteParams<string>('userId');
paramsStore.params.filterBy.authorId = userId.value;
onMounted(() => {
    getArticleList(paramsStore.params).then((res) => {
        articleList.value = res.data.data.data;
        total.value = res.data.data.total;
        isLoad.value = false;
    });
});

// request when change
const refParamsStore = storeToRefs(paramsStore);
watch(refParamsStore.params.value, () => {
    getArticleList(paramsStore.params).then((res) => {
        articleList.value = res.data.data.data;
        total.value = res.data.data.total;
        isLoad.value = false;
    });
});

const currentChange = (pageNumber: number) => {
    const store = useArticleParamsStore();
    store.params.pageNumber = pageNumber;
    getArticleList(store.params).then((res) => {
        articleList.value = res.data.data.data;
        isLoad.value = false;
        total.value = res.data.data.total;
    });
};

const historyList = ref<ViewHistoryEntity[]>();

const showHistory = ref<boolean>(false)

const userStore = useUserStore()

const getUserViewHistory = (pageNumber: number, pageSize: number) => {
    if (userStore.isLogin && userStore.user.userId === userId.value) {
        getViewHistory(userId.value, pageNumber, pageSize).then(res => {
            params.value.total = res.data.data.total
            if (res.data.data.currentSize > 0) {
                showHistory.value = true;
                historyList.value = res.data.data.data;
            }
        })
    }
}

onMounted(() => {
    getUserViewHistory(params.value.pageNumber, params.value.pageSize)
})


const params = ref<{ pageNumber: number, pageSize: number, total: number }>({pageNumber: 1, pageSize: 10, total: 0})

const historyCurrentChange = (pageNumber: number) => {
    params.value.pageNumber = pageNumber
    getUserViewHistory(params.value.pageNumber, params.value.pageSize);
}
</script>

<template>
    <transition appear>
        <div class="flex flex-row">
            <div class="flex flex-col w-8/12">
                <filter-by/>
                <div>
                    <Loading :is-loading="isLoad"/>
                    <all-type-preview-list :article-list="articleList" v-if="!isLoad"/>
                    <Pagination
                            :current-page="paramsStore.params.pageNumber"
                            :page-size="paramsStore.params.pageSize"
                            :total="total"
                            @numberChange="currentChange"
                            :hide-on-single-page="true"
                    />
                </div>
            </div>
            <div class="flex flex-col w-4/12">
                <option-menu/>
                <view-history :history-list="historyList ? historyList : []"/>
                <Pagination
                        :current-page="params.pageNumber"
                        :page-size="params.pageSize"
                        :total="params.total"
                        @numberChange="historyCurrentChange"
                        :hide-on-single-page="true"
                />
            </div>
        </div>
    </transition>
</template>
