<script setup lang="ts">
import { useArticleParamsStore, useFilterAndSortStore } from '../../pinia';
import { ArticleListEntity, getArticleList } from '../../axios/api/articleApi';
import { ref } from 'vue';
import { formatTime } from '../../utils';
import LikeBtn from '../index/articleList/LikeBtn.vue';
import { storeToRefs } from 'pinia';

const total = ref(0);
const isLoad = ref<boolean>(true);
const articleList = ref<ArticleListEntity[]>();
const paramsStore = useArticleParamsStore();

paramsStore.filterTypeChange(1);
getArticleList(paramsStore.params).then((res) => {
    articleList.value = res.data.data.data;
    isLoad.value = false;
});

// request when change
const refParamsStore = storeToRefs(paramsStore);
watch(refParamsStore.params.value, () => {
    isLoad.value = true;
    getArticleList(paramsStore.params).then((res) => {
        articleList.value = res.data.data.data;
        total.value = res.data.data.total;
        isLoad.value = false;
    });
});

const currentChange = (pageNumber: number) => {
    const store = useArticleParamsStore();
    store.params.pageNumber = pageNumber;
    isLoad.value = true;
    getArticleList(store.params).then((res) => {
        articleList.value = res.data.data.data;
        isLoad.value = false;
        total.value = res.data.data.total;
    });
};
</script>

<template>
    <Loading :is-loading="isLoad" />
    <div class="m-2" v-if="!isLoad">
        <div
            class="mb-2 bg-white dark:bg-dark rounded-md shadow-sm hover:shadow-md p-4 transition-all"
            v-for="a in articleList"
            :key="a.articleId"
        >
            <div class="flex flex-row p-0 text-gray-400">
                <div class="truncate">
                    <span class="hover:text-blue-500 cursor-pointer transition-all">{{ a.author.username }} · </span>
                    <span v-text="formatTime(a.releaseTime)"></span>
                    <span class="hover:text-blue-500 cursor-pointer transition-all" v-for="t in a.tags" :key="t.tagId">
                        · {{ t.tagName }}</span
                    >
                </div>
            </div>
            <div class="flex flex-col">
                <div
                    class="text-lg font-semibold text-left hover:text-blue-500 py-2 cursor-pointer transition-all"
                    @click="$router.push({ path: '/a/' + a.articleId })"
                >
                    {{ a.title }}
                </div>
                <div class="flex mb-4 text-gray-500 text-left leading-6">
                    {{ a.introduction }}
                </div>
            </div>
            <div class="flex flex-row">
                <LikeBtn :type="0" :id="a.articleId" />
                <CommentsLink />
                <ShareLink />
                <CollectionLink :type="0" :id="a.articleId" />
            </div>
        </div>
        <Pagination :page-size="paramsStore.params.pageSize" :total="total" @numberChange="currentChange" />
    </div>
</template>
