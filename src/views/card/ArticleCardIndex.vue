<script setup lang="ts">
import { ArticleListEntity, getArticleList } from '../../axios/api/articleApi';
import { Ref, ref } from 'vue';
import { useArticleParamsStore } from '../../pinia';
import { storeToRefs } from 'pinia';
import AllTypePreviewList from '../../components/common/AllTypePreviewList.vue';

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
const isEmpty = ref<boolean>(false);
watch(articleList, () => {
    isEmpty.value = articleList.value?.length == 0;
});
// init request
const data = ref({
    pageNumber: 1,
    pageSize: 10,
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
onMounted(() => {
    getArticleList(data.value).then((res) => {
        articleList.value = res.data.data.data;
        total.value = res.data.data.total;
        isLoad.value = false;
    });
});

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
        <all-type-preview-list
            :article-list="articleList"
            @articleListUpdate="currentChange(paramsStore.params.pageNumber)"
        />
        <Pagination
            :current-page="paramsStore.params.pageNumber"
            :page-size="paramsStore.params.pageSize"
            :total="total"
            @numberChange="currentChange"
            :hide-on-single-page="true"
        />
    </div>
</template>
