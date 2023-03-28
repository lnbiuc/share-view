<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { storeToRefs } from 'pinia';
import { ArticleListEntity, articleParams, getArticleList } from '../../axios/api/articleApi';
import { useArticleParamsStore, useDialogControlStore } from '../../pinia';
import { ref } from 'vue';
import axios from '../../axios';
import { formatTime } from '../../utils';
import router from '../../router';

const categoryId = useRouteParams<string>('categoryId');
// request when change
const total = ref(0);
const isLoad = ref<boolean>(true);

const paramsStore = useArticleParamsStore();
paramsStore.filterChangeCategory(categoryId.value);
const refParamsStore = storeToRefs(paramsStore);
const articleList = ref<ArticleListEntity[]>();
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
const tagBgColor = (type: string) => {
    switch (type) {
        case 'Post':
            return '#eebe77';
        case 'Question':
            return '#95d475';
        case 'Article':
            return '#79bbff';
        case 'Video':
            return '#fab6b6';
    }
};

const handleToArticleDetail = (type: string, articleId: string) => {
    switch (type) {
        case 'Article':
            return router.push({ path: '/a/' + articleId });
        case 'Question':
            return router.push({ path: '/q/' + articleId });
        case 'Post':
            return router.push({ path: '/p/' + articleId });
        case 'Video':
            return router.push({ path: '/v/' + articleId });
    }
};

const handleClickComment = (articleId: string, title: string, type: string, info: string) => {
    handleToArticleDetail(type, articleId);
    const dialogStore = useDialogControlStore();
    dialogStore.commentForm.status = true;
    dialogStore.commentForm.data.level = 0;
    dialogStore.commentForm.data.articleId = articleId;
    if (type == 'Post') {
        dialogStore.commentForm.displayInfo = info;
    } else {
        dialogStore.commentForm.displayInfo = title;
    }
};
</script>

<template>
    <div
        class="flex flex-row text-center justify-center md:m-auto md:my-2 ls:m-auto ls:my-2 lg:m-auto lg:my-2 sm:m-2 rounded-sm sm:max-w-full md:max-w-full ls:max-w-screen-ls lg:max-w-screen-lg"
    >
        <div class="flex flex-col w-9/12text-left rounded-md flex-grow">
            <div
                v-for="a in articleList"
                :key="a.articleId"
                v-if="!isLoad"
                class="flex flex-col p-5 dark:bg-dark bg-light hover:shadow-md shadow-sm mb-2 mx-2 rounded-md transition-all"
            >
                <div class="flex flex-row p-0 text-gray-400">
                    <div class="truncate">
                        <span class="hover:text-blue-500 cursor-pointer transition-all"
                            >{{ a.author.username }} ·
                        </span>
                        <span v-text="formatTime(a.releaseTime)"></span>
                        <span
                            class="hover:text-blue-500 cursor-pointer transition-all"
                            v-for="t in a.tags"
                            :key="t.tagId"
                        >
                            · {{ t.tagName }}</span
                        >
                    </div>
                </div>
                <div class="flex flex-row m">
                    <div class="my-2 flex flex-row align-middle">
                        <div class="text-left">
                            <span
                                :style="{ backgroundColor: tagBgColor(a.type) }"
                                class="px-2 mr-2 rounded-full m-auto transition-all type cursor-pointer"
                            >
                                {{ a.type }}
                            </span>
                            <span
                                class="text-lg hover:text-blue-500 py-1 cursor-pointer transition-all text-left"
                                @click="handleToArticleDetail(a.type, a.articleId)"
                                >{{ a.title }}</span
                            >
                        </div>
                    </div>
                </div>
                <div class="flex mb-4 text-sm text-gray-500 text-left">
                    {{ a.introduction }}
                </div>
                <div class="flex flex-row justify-start">
                    <CommentsLink
                        :comments="a.comments"
                        @click="handleClickComment(a.articleId, a.title, a.type, a.introduction)"
                    />
                    <ShareLink />
                    <CollectionLink :id="a.articleId" :type="0" />
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
        <div class="flex flex-col w-3/12">
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
        </div>
    </div>
</template>
