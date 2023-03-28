<script setup lang="ts">
import { ref } from 'vue';
import { ArticleListEntity, getArticleList } from '../../axios/api/articleApi';
import { useArticleParamsStore, useDialogControlStore } from '../../pinia';
import { formatTime } from '../../utils';
import { storeToRefs } from 'pinia';
import router from '../../router';
const articleList = ref<ArticleListEntity[]>();
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
            <div class="my-4 text-left">
                <span @click="$router.push({ path: '/p/' + a.articleId })" class="title leading-6">
                    {{ a.introduction }}</span
                >
            </div>
            <div class="mb-2 flex flex-row flex-wrap justify-center items-center">
                <div v-if="a.images.length > 0" class="w-full">
                    <div v-if="a.images.length === 1" class="max-h-[350px] overflow-hidden flex justify-center items-center">
						<img
							@click="showImages(a.images)"
							:src="a.images[0]"
							:alt="a.images[0]"
							class="h-full rounded-md shadow-sm hover:shadow-md my-2 transition-all rounded-md"
						>
                    </div>
					<div v-if="a.images.length === 2">
						<img
							@click="showImages(a.images)"
							:src="a.images[0]"
							:alt="a.images[0]"
							class="h-full object-cover rounded-md shadow-sm hover:shadow-md my-2 transition-all"
						>
						<img
							@click="showImages(a.images)"
							:src="a.images[1]"
							:alt="a.images[1]"
							class="h-full object-cover rounded-md shadow-sm hover:shadow-md my-2 transition-all"
						>
					</div>
                </div>
            </div>
            <div class="flex flex-row">
                <LikeBtn :type="0" :id="a.articleId" />
                <CommentsLink @click="handleClickComment(a.articleId, a.introduction)" />
                <ShareLink />
                <CollectionLink :type="0" :id="a.articleId" />
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
</template>
