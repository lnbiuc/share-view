<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ArticleListEntity, getArticleList } from '../../axios/api/articleApi';
import { useArticleParamsStore } from '../../pinia';
import { formatTime } from '../../utils';
import { storeToRefs } from 'pinia';

const articleList = ref<ArticleListEntity[]>();
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
                class="my-1 mb-3 text-left ml-2 pl-2 text-2xl cursor-pointer hover:text-blue-500 transition-all"
            >
                {{ a.introduction }}
            </div>
            <div class="p-2" @click="$router.push({ path: '/v/' + a.articleId })">
                <div
                    class="h-[300px] rounded-md shadow-md mb-2 bg-cover flex justify-center items-center video-preview"
                    :style="{ background: 'url(' + a.images[0] + ') center center no-repeat' }"
                >
                    <el-icon size="100" color="rgb(156,163,175)" class="play-btn cursor-pointer">
                        <i-material-symbols-play-circle-outline />
                    </el-icon>
                </div>
            </div>
            <div class="truncate flex flex-row dark:text-gray-300 text-gray-800 ml-2 mb-3 items-center">
                <div class="mr-2">
                    <el-avatar :src="a.author.avatar" shape="square" />
                </div>
                <span class="hover:text-blue-500 text-xl cursor-pointer transition-all"
                    >{{ a.author.username }} ·&nbsp;</span
                >
                <span v-text="formatTime(a.releaseTime)"></span>
                <span
                    class="hover:text-blue-500 cursor-pointer transition-all text-gray-500 dark:text-gray-400"
                    v-for="t in a.tags"
                    :key="t.tagId"
                >
                    &nbsp;· {{ t.tagName }}</span
                >
            </div>
            <div class="flex flex-row">
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

.play-btn,
.play-btn:before {
    opacity: 0;
    transition: 0.2s all ease;
}

.play-btn:hover {
    color: rgb(229, 231, 235);
    transition: 0.2s all ease;
}
</style>
