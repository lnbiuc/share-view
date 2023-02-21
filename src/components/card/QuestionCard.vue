<script setup lang="ts">
import { ref } from 'vue';
import { ArticleListEntity, getArticleList } from '../../api/article/articleApi';
import { useArticleParamsStore } from '../../pinia';
// @ts-ignore
import { View } from '@element-plus/icons-vue';
const articleList = ref<ArticleListEntity[]>();
const paramsStore = useArticleParamsStore();
paramsStore.filterTypeChange(2);
const isLoading = ref<boolean>(true);
getArticleList(paramsStore.params).then((res) => {
    articleList.value = res.data.data.data;
    isLoading.value = false;
});
</script>

<template>
    <Loading :is-loading="isLoading" v-if="!isLoading" />
    <div class="m-2">
        <div
            v-for="(a, i) in articleList"
            :key="a.articleId"
            class="flex flex-row mb-2 bg-white transition-all dark:bg-dark rounded-md shadow-sm hover:shadow-md p-4"
        >
            <div class="flex flex-col justify-around w-2/12">
                <span class="text-3xl text-gray-500">{{ i + 1 }}</span>
                <span />
            </div>
            <div class="w-10/12">
                <div
                    class="text-md font-semibold text-left hover:text-blue-500 py-2 cursor-pointer transition-all"
                    @click="$router.push({ path: '/q/' + a.articleId })"
                >
                    {{ a.title }}
                </div>
                <!--                <div class="flex mb-4 text-gray-500 text-left leading-6">-->
                <!--                    {{ a.introduction }}-->
                <!--                </div>-->
                <div class="flex flex-row items-center">
                    <ShareLink />
                    <el-icon color="gray" class="ml-5 mr-1"><View /></el-icon>
                    <span class="text-gray-500">{{ a.views }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
