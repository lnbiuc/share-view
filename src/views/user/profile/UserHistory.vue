<script setup lang="ts">
import { ArticleListEntity, getViewHistory, ViewHistoryEntity } from '../../../axios/api/articleApi';
import { Ref } from 'vue';
import { useRouteParams } from '@vueuse/router';

const historyList: Ref<ViewHistoryEntity[]> = ref([
    {
        articleId: '',
        viewTime: '',
        articleVo: {
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
            category: 0,
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
    },
]);

const publishArticleList: Ref<ArticleListEntity[]> = ref([
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
        category: 0,
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

const timeList = ref<string[]>([]);

const isLoad = ref<boolean>(true);
const params = ref<{ pageNumber: number; pageSize: number; total: number }>({ pageNumber: 1, pageSize: 10, total: 0 });

const userId = useRouteParams<string>('userId');
const getUserHistory = () => {
    isLoad.value = true;
    getViewHistory(userId.value, params.value.pageNumber, params.value.pageSize).then((res) => {
        historyList.value = res.data.data.data;
        const convertedHistoryList: ArticleListEntity[] = [];
        historyList.value.forEach((item) => {
            convertedHistoryList.push(item.articleVo);
            timeList.value.push(item.viewTime);
        });
        publishArticleList.value = convertedHistoryList;
        isLoad.value = false;
        params.value.total = res.data.data.total;
    });
};

onMounted(() => {
    getUserHistory();
});

const handleCurrentChange = (pageNumber: number) => {
    params.value.pageNumber = pageNumber;
    getUserHistory();
};
</script>

<template>
    <div>
        <loading :is-loading="isLoad" />
        <all-type-preview-list
            :article-list="publishArticleList"
            v-if="!isLoad"
            :view-time="timeList"
            :option-type="'History'"
            @article-list-update="handleCurrentChange(params.pageNumber)"
        />
        <Pagination
            :current-page="params.pageNumber"
            :page-size="params.pageSize"
            :total="params.total"
            @numberChange="handleCurrentChange"
            :hide-on-single-page="true"
        />
    </div>
</template>
