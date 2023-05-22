<script setup lang="ts">
import { Ref, ref } from 'vue';
import { ArticleListEntity, getArticleList } from '../../axios/api/articleApi';
import { useArticleParamsStore } from '../../pinia';
import { storeToRefs } from 'pinia';
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
paramsStore.filterTypeChange(2);
const total = ref(0);
const isLoad = ref<boolean>(true);
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
    <Loading :is-loading="isLoad" v-if="isLoad" />
    <transition>
        <div class="m-2" v-if="!isLoad">
            <div
                v-for="(a, i) in articleList"
                :key="a.articleId"
                class="flex flex-row mb-2 bg-light transition-all dark:bg-dark rounded-md shadow-sm hover:shadow-md py-4 pr-4 pl-2"
            >
                <div class="flex flex-col justify-around w-1/12">
                    <span class="text-3xl text-gray-500">{{ i + 1 }}</span>
                    <span />
                </div>
                <div class="w-11/12 ml-2">
                    <div class="text-left py-2 title" @click="$router.push({ path: '/q/' + a.articleId })">
                        {{ a.title }}
                    </div>
                    <div class="flex flex-row items-center">
                        <ShareLink :article-id="a.articleId" :article-type="a.type" />
                        <el-icon :size="20" color="rgb(156, 163, 175)" class="ml-5 mr-1">
                            <i-ant-design-eye-outlined />
                        </el-icon>
                        <span class="text-gray-500">{{ a.views }}</span>
                    </div>
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
    </transition>
</template>
