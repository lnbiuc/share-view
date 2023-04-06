<script setup lang="ts">
import { Ref, ref } from 'vue';
import { ArticleListEntity, getArticleList } from '../../axios/api/articleApi';
import { useArticleParamsStore, useDialogControlStore } from '../../pinia';
import { formatTime } from '../../utils';
import { storeToRefs } from 'pinia';
import router from '../../router';
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
const paramsStore = useArticleParamsStore();
paramsStore.filterTypeChange(3);
const isLoad = ref<boolean>(true);
getArticleList(paramsStore.params).then((res) => {
    articleList.value = res.data.data.data;
    total.value = res.data.data.total;
    isLoad.value = false;
});

const { proxy }: any = getCurrentInstance();
const showImages = (img: string[]) => {
    proxy.$viewerApi({
        images: img,
    });
};

// request when change
const total = ref(0);
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
    paramsStore.params.pageNumber = pageNumber;
    isLoad.value = true;
    getArticleList(paramsStore.params).then((res) => {
        articleList.value = res.data.data.data;
        isLoad.value = false;
        total.value = res.data.data.total;
    });
};

const handleClickComment = (articleId: string, info: string) => {
    router.push({ path: '/p/' + articleId });
    const store = useDialogControlStore();
    store.commentForm.status = true;
    store.commentForm.displayInfo = info;
    store.commentForm.data.level = 0;
    store.commentForm.data.articleId = articleId;
};
</script>

<template>
    <Loading :is-loading="isLoad" />
    <Transition appear>
        <div class="mr-2 ml-2" v-if="!isLoad">
            <div
                v-for="a in articleList"
                :key="a.articleId"
                class="flex flex-col mt-2 bg-light transition-all dark:bg-dark rounded-md shadow-sm hover:shadow-md p-4"
            >
                <div class="flex flex-row justify-start">
                    <div class="flex flex-row justify-center items-center">
                        <el-avatar class="mr-4" size="large" :src="a.author.avatar" />
                        <span class="text-xl mr-2 title">{{ a.author.username }}</span>
                        <span class="text-sm text-gray-500 mt-1">@{{ a.author.userId }}&nbsp;·&nbsp;</span>
                        <span class="text-sm text-gray-500 mt-1" v-text="formatTime(a.releaseTime)"></span>
                    </div>
                </div>
                <div class="mt-4 mb-2 text-left">
                <span @click="$router.push({ path: '/p/' + a.articleId })" class="title leading-6">
                    {{ a.introduction }}</span
                >
                </div>
                <div class="flex flex-row flex-wrap justify-center items-center">
                    <div v-if="a.images.length > 0" class="w-full">
                        <div
                            v-if="a.images.length === 1"
                            class="grid grid-cols-1 grid-rows-1 gap-2"
                        >
                            <div
                                @click="showImages(a.images)"
                                :style="{
                                backgroundImage: 'url(' + a.images[0] + ')',
                                background: 'center center / no-repeat',
                            }"
                                class="bg-cover bg-center h-[350px] w-full rounded-sm shadow-sm"
                            ></div>
                        </div>
                        <div v-if="a.images.length === 2" class="grid grid-cols-2 grid-rows-1 gap-2">
                            <div
                                v-for="image in a.images"
                                @click="showImages(a.images)"
                                :style="{
                                backgroundImage: 'url(' + image + ')',
                                background: 'center center / no-repeat',
                            }"
                                class="bg-cover bg-center h-[250px] w-full rounded-sm shadow-sm"
                            ></div>
                        </div>
                        <div v-if="a.images.length <= 4 && a.images.length >= 3" class="grid grid-cols-2 grid-rows-2 gap-2">
                            <div
                                v-for="image in a.images"
                                @click="showImages(a.images)"
                                :style="{
                                    backgroundImage: 'url(' + image + ')',
                                    background: 'center center / no-repeat',
                                }"
                                class="bg-cover bg-center h-[200px] w-full rounded-sm shadow-sm"
                            ></div>
                        </div>
                        <div v-if="a.images.length >= 5 && a.images.length <= 6" class="grid grid-cols-3 grid-rows-2 gap-2">
                            <div
                                v-for="image in a.images"
                                @click="showImages(a.images)"
                                :style="{
                                    backgroundImage: 'url(' + image + ')',
                                    background: 'center center / no-repeat',
                                }"
                                class="bg-cover bg-center h-[200px] w-full rounded-sm shadow-sm"
                            ></div>
                        </div>
                        <div v-if="a.images.length >= 6" class="grid grid-cols-3 grid-rows-3 gap-2">
                            <div
                                v-for="image in a.images"
                                @click="showImages(a.images)"
                                :style="{
                                    backgroundImage: 'url(' + image + ')',
                                    background: 'center center / no-repeat',
                                }"
                                class="bg-cover bg-center h-[200px] w-full rounded-sm shadow-sm"
                            ></div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-row mt-4">
                    <LikeBtn :type="0" :id="a.articleId" />
                    <CommentsLink @click="handleClickComment(a.articleId, a.introduction)" :comments="a.comments"/>
                    <ShareLink />
                    <CollectionLink :collect-count="a.collect" :type="0" :id="a.articleId" />
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
    </Transition>
</template>
<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>