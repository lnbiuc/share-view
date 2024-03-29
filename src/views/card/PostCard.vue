<script setup lang="ts">
import { Ref, ref } from 'vue';
import { ArticleListEntity, getArticleList } from '../../axios/api/articleApi';
import { useArticleParamsStore, useDialogControlStore } from '../../pinia';
import { formatTime } from '../../utils';
import { storeToRefs } from 'pinia';
import router from '../../router';
import ImageGirdLayout from '../../layout/ImageGirdLayout.vue';

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
paramsStore.filterTypeChange(3);
const isLoad = ref<boolean>(true);
onMounted(() => {
    isLoad.value = true;
    getArticleList(paramsStore.params).then((res) => {
        articleList.value = res.data.data.data;
        total.value = res.data.data.total;
        isLoad.value = false;
    });
});

// request when change
const total = ref(0);
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
    paramsStore.params.pageNumber = pageNumber;
    isLoad.value = true;
    getArticleList(paramsStore.params).then((res) => {
        articleList.value = res.data.data.data;
        isLoad.value = false;
        total.value = res.data.data.total;
    });
};

const handleClickComment = (articleId: string, info: string) => {
    router.push({ path: '/p/' + articleId });
    const store = useDialogControlStore();
    store.commentForm.status = true;
    store.commentForm.displayInfo = info;
    store.commentForm.data.level = 0;
    store.commentForm.data.articleId = articleId;
};

const refresh = () => {
    getArticleList(paramsStore.params).then((res) => {
        articleList.value = res.data.data.data;
        total.value = res.data.data.total;
        isLoad.value = false;
    });
};
</script>

<template>
    <Loading :is-loading="isLoad" />
    <Transition>
        <div class="mr-2 ml-2" v-if="!isLoad">
            <div
                v-for="a in articleList"
                :key="a.articleId"
                class="flex flex-col mt-2 bg-light transition-all dark:bg-dark rounded-md shadow-sm hover:shadow-md p-4"
            >
                <div class="flex flex-row justify-start">
                    <div class="flex flex-row justify-center items-center">
                        <el-avatar class="mr-4" size="large" :src="a.author.avatar" />
                        <span class="text-xl mr-2 title" @click="$router.push('/u/p/' + a.author.userId)">{{
                            a.author.username
                        }}</span>
                        <span class="text-xs text-gray-500 mt-1">@{{ a.author.userId }}&nbsp;·&nbsp;</span>
                        <span class="text-sm text-gray-500 mt-1" v-text="formatTime(a.releaseTime)"></span>
                    </div>
                </div>
                <div class="mt-4 mb-2 text-left">
                    <span @click="$router.push({ path: '/p/' + a.articleId })" class="title leading-6">
                        {{ a.introduction }}</span
                    >
                </div>
                <image-gird-layout :images="a.images" />
                <div class="flex flex-row mt-4">
                    <LikeBtn :type="0" :id="a.articleId" :like="a.like" @on-like-success="refresh" />
                    <CommentsLink @click="handleClickComment(a.articleId, a.introduction)" :comments="a.comments" />
                    <ShareLink :article-type="a.type" :article-id="a.articleId" />
                    <CollectionLink :collect-count="a.collect" :type="0" :id="a.articleId" />
                </div>
            </div>
            <Pagination
                :current-page="paramsStore.params.pageNumber"
                :page-size="paramsStore.params.pageSize"
                :total="total"
                @numberChange="currentChange"
                :hide-on-single-page="true"
            />
        </div>
    </Transition>
</template>
<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
