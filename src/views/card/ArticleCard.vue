<script setup lang="ts">
import { useArticleParamsStore, useDialogControlStore } from '../../pinia';
import { ArticleListEntity, getArticleList } from '../../axios/api/articleApi';
import { Ref, ref } from 'vue';
import { formatTime, handleClickComment } from '../../utils';
import LikeBtn from '../../components/index/articleList/LikeBtn.vue';
import { storeToRefs } from 'pinia';
import router from '../../router';

const total = ref(0);
const isLoad = ref<boolean>(true);
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

paramsStore.filterTypeChange(1);
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
    <Loading :is-loading="isLoad" />
    <transition>
        <div class="m-2" v-if="!isLoad">
            <div
                class="mb-2 bg-light dark:bg-dark rounded-md shadow-sm hover:shadow-md p-4 transition-all"
                v-for="a in articleList"
                :key="a.articleId"
            >
                <div class="flex flex-row p-0 text-gray-400">
                    <div class="truncate">
                        <span
                            class="hover:text-blue-500 cursor-pointer transition-all"
                            @click="$router.push('/u/p/' + a.author.userId)"
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
                <div class="flex flex-col">
                    <div class="text-lg text-left py-2 title" @click="$router.push({ path: '/a/' + a.articleId })">
                        {{ a.title }}
                    </div>
                    <div class="flex mb-4 text-gray-500 text-left leading-6 text-sm">
                        {{ a.introduction }}
                    </div>
                </div>
                <div class="flex flex-row flex-wrap justify-start items-center">
                    <LikeBtn :type="0" :id="a.articleId" class="mr-4" />
                    <CommentsLink
                        @click="handleClickComment(a.articleId, a.title, a.type, a.introduction, $router)"
                        :comments="a.comments"
                    />
                    <CollectionLink :type="0" :id="a.articleId" :collect-count="a.collect" />
                    <ShareLink :article-id="a.articleId" :article-type="a.type" />
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
    </transition>
</template>
