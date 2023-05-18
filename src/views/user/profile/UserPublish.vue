<script setup lang="ts">
import { ref, Ref } from 'vue';
import { ArticleListEntity, getArticleList } from '../../../axios/api/articleApi';
import { useArticleParamsStore, useUpdateArticleStore } from '../../../pinia';
import { useRouteParams } from '@vueuse/router';
import { storeToRefs } from 'pinia';

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

const paramsStore = useArticleParamsStore();
paramsStore.filterTypeChange(0);
const userId = useRouteParams<string>('userId');
paramsStore.params.filterBy.authorId = userId.value;

const isLoad = ref<boolean>(true);

const total = ref<number>(0);
const getUserPublish = () => {
    isLoad.value = true;
    getArticleList(paramsStore.params).then((res) => {
        isLoad.value = false;
        publishArticleList.value = res.data.data.data;
        total.value = res.data.data.total;
    });
};

onMounted(() => {
    getUserPublish();
});

const handleCurrentChange = (pageNumber: number) => {
    paramsStore.params.pageNumber = pageNumber;
    getUserPublish();
};

const updateArticleStore = useUpdateArticleStore();
const refUpdateArticleStore = storeToRefs(updateArticleStore);
watch(refUpdateArticleStore.count, () => {
    getUserPublish();
});

const updateArticleList = () => {
    getUserPublish();
};
</script>

<template>
    <div>
        <loading :is-loading="isLoad" />
        <all-type-preview-list
            :article-list="publishArticleList"
            v-if="!isLoad"
            @articleListUpdate="updateArticleList"
        />
        <Pagination
            :current-page="paramsStore.params.pageNumber"
            :page-size="paramsStore.params.pageSize"
            :total="total"
            @numberChange="handleCurrentChange"
            :hide-on-single-page="true"
        />
    </div>
</template>
