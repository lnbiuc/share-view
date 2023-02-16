<script setup lang="ts">
import { ref } from 'vue';
import { ArticleListEntity, getArticleList } from '../../api/article/articleApi';
import { useArticleParamsStore } from '../../pinia';
import { formatTime } from '../../utils';

const articleList = ref<ArticleListEntity[]>();
const paramsStore = useArticleParamsStore();
paramsStore.filterTypeChange(4);
const isLoading = ref<boolean>(true);
getArticleList(paramsStore.params).then((res) => {
    articleList.value = res.data.data.data;
    isLoading.value = false;
});
</script>

<template>
    <div class="m-2">
        <div
            v-for="a in articleList"
            class="flex flex-col mb-2 bg-white transition-all dark:bg-dark rounded-md shadow-sm hover:shadow-md p-4"
        >
            <div class="my-20" @click="$router.push({ path: '/v/' + a.articleId })">Video</div>
            <div class="truncate flex flex-row dark:text-gray-300 text-gray-800 ml-2">
                <span class="hover:text-blue-500 cursor-pointer transition-all">{{ a.author.username }} · </span>
                <span v-text="formatTime(a.releaseTime)"></span>
                <span class="hover:text-blue-500 cursor-pointer transition-all" v-for="t in a.tags" :key="t.tagId">
                    · {{ t.tagName }}</span
                >
            </div>
            <div class="my-3 text-left ml-2">
                {{ a.introduction }}
            </div>
            <div class="flex flex-row">
                <CommentsLink />
                <ShareLink />
                <CollectionLink />
            </div>
        </div>
    </div>
</template>
