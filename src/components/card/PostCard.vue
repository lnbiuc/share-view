<script setup lang="ts">
import { ref } from 'vue';
import { ArticleListEntity, getArticleList } from '../../api/article/articleApi';
import { useArticleParamsStore } from '../../pinia';
import { formatTime } from '../../utils';

const articleList = ref<ArticleListEntity[]>();
const paramsStore = useArticleParamsStore();
paramsStore.filterTypeChange(3);
const isLoading = ref<boolean>(true);
getArticleList(paramsStore.params).then((res) => {
    articleList.value = res.data.data.data;
    isLoading.value = false;
});
</script>

<template>
    <Loading :is-loading="isLoading" />
    <div class="m-2">
        <div
            v-for="a in articleList"
            :key="a.articleId"
            @click="$router.push({ path: '/p/' + a.articleId })"
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
                <span class="dark:text-gray-300 text-gray-800">{{ a.introduction }}</span>
            </div>
            <div class="my-20">img</div>
            <div class="flex flex-row">
                <LikeBtn />
                <CommentsLink />
                <ShareLink />
                <CollectionLink />
            </div>
        </div>
    </div>
</template>
