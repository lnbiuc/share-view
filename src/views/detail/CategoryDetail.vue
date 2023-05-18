<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { storeToRefs } from 'pinia';
import { ArticleListEntity } from '../../axios/api/articleApi';
import { useArticleParamsStore } from '../../pinia';
import { Ref, ref } from 'vue';
import axios from '../../axios';
import { formatTime } from '../../utils';
import AllTypePreviewList from '../../components/common/AllTypePreviewList.vue';
import CategoryDetailLayout from '../../layout/CategoryDetailLayout.vue';

const categoryId = useRouteParams<string>('categoryId');
// request when change
const total = ref(0);
const isLoad = ref<boolean>(true);

const paramsStore = useArticleParamsStore();
paramsStore.resetAll();
paramsStore.filterChangeCategory(categoryId.value);
const refParamsStore = storeToRefs(paramsStore);
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
const requestArticle = async () => {
    return axios.post('../api/article/page', paramsStore.params);
};
const requestCategory = async () => {
    return axios.get('../api/category/get/' + categoryId.value);
};
requestArticle().then((res) => {
    articleList.value = res.data.data.data;
    isLoad.value = false;
});
const category = ref({
    'id': 0,
    'name': '',
    'author': {
        'userId': '',
        'username': '',
        'signature': '',
        'avatar': '',
        'level': 0,
        'ipAddr': '',
    },
    'introduction': '',
    'avatar': '',
    'createTime': '',
});
requestCategory().then((res) => {
    category.value = res.data.data;
});
watch(refParamsStore.params.value, () => {
    isLoad.value = true;
    requestArticle().then((res) => {
        articleList.value = res.data.data.data;
        total.value = res.data.data.total;
        isLoad.value = false;
    });
});

const currentChange = (pageNumber: number) => {
    const store = useArticleParamsStore();
    store.params.pageNumber = pageNumber;
    isLoad.value = true;
    requestArticle().then((res) => {
        articleList.value = res.data.data.data;
        isLoad.value = false;
        total.value = res.data.data.total;
    });
};
</script>

<template>
    <category-detail-layout>
        <template #left>
            <div class="flex flex-col text-left rounded-md flex-grow">
                <all-type-preview-list :article-list="articleList" />
                <Pagination
                    :current-page="paramsStore.params.pageNumber"
                    :page-size="paramsStore.params.pageSize"
                    :total="total"
                    @numberChange="currentChange"
                    :hide-on-single-page="true"
                />
            </div>
        </template>
        <template #right>
            <el-affix :offset="10">
                <div class="flex flex-col rounded-md shadow-sm bg-light p-4 justify-center items-center dark:bg-dark">
                    <el-avatar :src="category.avatar" :size="140" shape="square" />
                    <span class="text-xl my-2 font-semibold">{{ category.name }}</span>
                    <span class="text-left text-gray-500 text-sm mb-2">
                        Create In
                        <el-tooltip placement="top-start" :content="category.createTime">
                            <span class="cursor-pointer">
                                {{ formatTime(category.createTime) }}
                            </span>
                        </el-tooltip>
                    </span>
                    <span
                        class="hover:text-blue-500 cursor-pointer transition-all text-gray-500 text-left mb-1 text-xl"
                        @click="$router.push({ path: '/a/' + category.author.userId })"
                    >
                        By {{ category.author.username }}
                    </span>
                    <span class="text-sm text-gray-500">
                        {{ category.introduction }}
                    </span>
                </div>
            </el-affix>
        </template>
    </category-detail-layout>
</template>
