<script setup lang="ts">
import { ref } from 'vue';
import { ArticleListEntity, getArticleList } from '../../axios/api/articleApi';
import { useArticleParamsStore } from '../../pinia';
// @ts-ignore
import { View } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';
const articleList = ref<ArticleListEntity[]>();
const paramsStore = useArticleParamsStore();
paramsStore.filterTypeChange(2);
const total = ref(0)
const isLoad = ref<boolean>(true);
getArticleList(paramsStore.params).then((res) => {
    articleList.value = res.data.data.data;
    isLoad.value = false;
});

// request when change
const refParamsStore = storeToRefs(paramsStore)
watch(refParamsStore.params.value, () => {
    isLoad.value = true
    getArticleList(paramsStore.params).then((res) => {
        articleList.value = res.data.data.data;
        total.value = res.data.data.total
        isLoad.value = false;
    });
})

const currentChange = (pageNumber:number) => {
    const store = useArticleParamsStore()
    store.params.pageNumber = pageNumber;
    isLoad.value = true
    getArticleList(store.params).then((res) => {
        articleList.value = res.data.data.data;
        isLoad.value = false;
        total.value = res.data.data.total
    });
}
</script>

<template>
    <Loading :is-loading="isLoad" v-if="!isLoad" />
    <div class="m-2">
        <div
            v-for="(a, i) in articleList"
            :key="a.articleId"
            class="flex flex-row mb-2 bg-white transition-all dark:bg-dark rounded-md shadow-sm hover:shadow-md p-4"
        >
            <div class="flex flex-col justify-around w-1/12">
                <span class="text-3xl text-gray-500">{{ i + 1 }}</span>
                <span />
            </div>
            <div class="w-11/12">
                <div
                    class="text-md font-semibold text-left hover:text-blue-500 py-2 cursor-pointer transition-all"
                    @click="$router.push({ path: '/q/' + a.articleId })"
                >
                    {{ a.title }}
                </div>
                <div class="flex flex-row items-center">
                    <ShareLink />
                    <el-icon color="gray" class="ml-5 mr-1"><View /></el-icon>
                    <span class="text-gray-500">{{ a.views }}</span>
                </div>
            </div>
        </div>
        <Pagination :page-size="paramsStore.params.pageSize" :total="total" @numberChange="currentChange"/>
    </div>
</template>
