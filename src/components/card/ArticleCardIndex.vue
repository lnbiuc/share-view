<script setup lang="ts">
import ShareLink from '../index/articleList/ShareLink.vue';
import CollectionLink from '../index/articleList/CollectionLink.vue';
import CommentsLink from '../index/articleList/CommentsLink.vue';
import { ArticleListEntity, getArticleList } from '../../axios/api/articleApi';
import { formatTime } from '../../utils';
import { ref } from 'vue';
import { useArticleParamsStore } from '../../pinia';
import { storeToRefs } from 'pinia';

const articleList = ref<ArticleListEntity[]>();
const isEmpty = ref<boolean>(false);
watch(articleList, () => {
    isEmpty.value = articleList.value?.length == 0;
});
// init request
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
        hot: true,
        releaseTime: false,
        subscribe: false,
    },
});

const total = ref(0);
const isLoad = ref<boolean>(true);
const paramsStore = useArticleParamsStore();
paramsStore.filterTypeChange(0);
getArticleList(data.value).then((res) => {
    articleList.value = res.data.data.data;
    total.value = res.data.data.total;
    isLoad.value = false;
});

const tagBgColor = (type: string) => {
    switch (type) {
        case 'Post':
            return '#eebe77';
        case 'Question':
            return '#95d475';
        case 'Article':
            return '#79bbff';
        case 'Video':
            return '#fab6b6';
    }
};
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
</script>
<template>
    <div class="text-center">
        <Loading :is-loading="isLoad" />
        <NoResult :is-display="isEmpty" />
        <div
            v-for="a in articleList"
            :key="a.articleId"
            v-if="!isLoad"
            class="flex flex-col p-5 dark:bg-dark bg-white hover:shadow-md shadow-sm mt-2 mx-2 rounded-md transition-all"
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
            <div class="flex flex-row m">
                <div class="my-2 flex flex-row align-middle">
                    <div class="text-left">
                        <span
                            :style="{ backgroundColor: tagBgColor(a.type) }"
                            class="px-2 mr-2 rounded-full m-auto transition-all type cursor-pointer"
                        >
                            {{ a.type }}
                        </span>
                        <span
                            class="text-lg hover:text-blue-500 py-1 cursor-pointer transition-all text-left"
                            @click="$router.push({ path: '/a/' + a.articleId })"
                            >{{ a.title }}</span
                        >
                    </div>
                </div>
            </div>
            <div class="flex mb-4 text-sm text-gray-500 text-left">
                {{ a.introduction }}
            </div>
            <div class="flex flex-row justify-start">
                <CommentsLink :comments="a.comments" />
                <ShareLink />
                <CollectionLink :id="a.articleId" :type="0" />
            </div>
        </div>
        <Pagination :page-size="data.pageSize" :total="total" @numberChange="currentChange" />
    </div>
</template>
<style scoped>
.type {
    opacity: 0.9;
}
.type:hover {
    opacity: 1;
}
</style>
