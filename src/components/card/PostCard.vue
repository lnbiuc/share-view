<script setup lang="ts">
import { ref } from 'vue';
import { ArticleListEntity, getArticleList } from '../../api/articleApi';
import { useArticleParamsStore } from '../../pinia';
import { formatTime } from '../../utils';
import { getPostImages } from '../../api/postApi';

const articleList = ref<ArticleListEntity[]>();
const paramsStore = useArticleParamsStore();
paramsStore.filterTypeChange(3);
const isLoading = ref<boolean>(true);
getArticleList(paramsStore.params).then((res) => {
    articleList.value = res.data.data.data;
    isLoading.value = false;
});
const getImages = (articleId: string, userId: string) => {
    const images = ref<string[]>();
    getPostImages(articleId, userId).then((res) => {
        images.value = res.data.data;
    });
};
</script>

<template>
    <Loading :is-loading="isLoading" />
    <div class="m-2" v-if="!isLoading">
        <div
            v-for="a in articleList"
            :key="a.articleId"
            class="flex flex-col mb-2 bg-white transition-all dark:bg-dark rounded-md shadow-sm hover:shadow-md p-4"
        >
            <div class="flex flex-row justify-start">
                <div class="flex flex-row justify-center items-center">
                    <el-avatar class="mr-4" size="large" :src="a.author.avatar" />
                    <span class="text-2xl mr-2 dark:text-gray-300 text-gray-800">{{ a.author.username }}</span>
                    <span class="text-sm text-gray-500 mt-1">@{{ a.author.userId }}&nbsp;&nbsp;&nbsp;</span>
                    <span class="text-sm text-gray-500 mt-1" v-text="formatTime(a.releaseTime)"></span>
                </div>
            </div>
            <div class="my-4 text-left">
                <span
                    @click="$router.push({ path: '/p/' + a.articleId })"
                    class="dark:text-gray-300 text-gray-800 hover:text-blue-500 transition-all cursor-pointer"
                >
                    {{ a.introduction }}</span
                >
            </div>
            <div class="my-20">
                <!--                <div v-for="i in getImages(a.articleId, a.author.userId)">-->
                <!--                    {{ i }}-->
                <!--                </div>-->
            </div>
            <div class="flex flex-row">
                <LikeBtn />
                <CommentsLink />
                <ShareLink />
                <CollectionLink />
            </div>
        </div>
    </div>
</template>
