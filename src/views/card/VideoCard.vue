<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { ArticleListEntity, getArticleList } from '../../axios/api/articleApi';
import { useArticleParamsStore } from '../../pinia';
import { formatTime } from '../../utils';
import { storeToRefs } from 'pinia';
import VideoCardLayout from '../../layout/VideoCardLayout.vue';

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
const paramsStore = useArticleParamsStore();
paramsStore.filterTypeChange(4);
const isLoading = ref<boolean>(true);

const fetchData = () => {
    getArticleList(paramsStore.params).then((res) => {
        articleList.value = res.data.data.data;
        total.value = res.data.data.total;
        isLoading.value = false;
    });
};

onMounted(() => {
    fetchData();
});

const total = ref<number>(0);
const currentChange = (pageNumber: number) => {
    paramsStore.params.pageNumber = pageNumber;
    isLoading.value = true;
    fetchData();
};

// request when change
const refParamsStore = storeToRefs(paramsStore);
watch(refParamsStore.params.value, () => {
    isLoading.value = true;
    fetchData();
});
</script>

<template>
    <Loading :is-loading="isLoading" />
    <div class="m-2">
        <div
            v-for="a in articleList"
            v-show="!isLoading"
            class="flex flex-col mb-2 bg-light transition-all dark:bg-dark rounded-md shadow-sm hover:shadow-md p-4"
        >
            <div
                @click="$router.push({ path: '/v/' + a.articleId })"
                class="my-1 mb-3 title text-left pl-2 text-2xl cursor-pointer hover:text-blue-500 transition-all"
            >
                {{ a.introduction }}
            </div>
            <video-card-layout :images="a.images[0]" :article-id="a.articleId" class="px-2 mb-2" />
            <div class="truncate flex flex-row dark:text-gray-300 text-gray-800 ml-2 mb-3 items-center">
                <div class="mr-2">
                    <el-avatar :src="a.author.avatar" shape="square" />
                </div>
                <span class="hover:text-blue-500 text-xl cursor-pointer transition-all"
                    >{{ a.author.username }} ·&nbsp;</span
                >
                <span v-text="formatTime(a.releaseTime)"></span>
                <span class="title" v-for="t in a.tags" :key="t.tagId"> &nbsp;· {{ t.tagName }}</span>
            </div>
            <div class="flex flex-row ml-2">
                <CommentsLink />
                <ShareLink />
                <CollectionLink />
            </div>
        </div>
        <Pagination
            :current-page="paramsStore.params.pageNumber"
            :page-size="paramsStore.params.pageSize"
            :total="total"
            hide-on-single-page
            @numberChange="currentChange"
        />
    </div>
</template>
<style scoped>
.video-preview:hover > .play-btn {
    opacity: 0.8;
    transition: 0.2s all ease;
}
</style>
