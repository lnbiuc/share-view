<script setup lang="ts">
import ShareLink from '../../components/index/articleList/ShareLink.vue';
import CollectionLink from '../../components/index/articleList/CollectionLink.vue';
import CommentsLink from '../../components/index/articleList/CommentsLink.vue';
import { ArticleListEntity, getArticleList } from '../../axios/api/articleApi';
import { formatTime } from '../../utils';
import { ref } from 'vue';
import { useArticleParamsStore, useDialogControlStore, useUserStore } from '../../pinia';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
const articleList = ref<ArticleListEntity[]>();
const isEmpty = ref<boolean>(false);
watch(articleList, () => {
    isEmpty.value = articleList.value?.length == 0;
});
// init request
const data = ref({
    pageNumber: 1,
    pageSize: 7,
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

const router = useRouter();
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
    const userStore = useUserStore();
    if (userStore.isLogin) {
        goArticleAndComment(articleId, title, type, info);
    } else {
        const dialogStore = useDialogControlStore();
        dialogStore.loginForm = true;
        const refUserStore = storeToRefs(userStore);
        const stop = watch(refUserStore.isLogin, () => {
            if (refUserStore.isLogin) {
                goArticleAndComment(articleId, title, type, info);
            }
            stop();
        });
    }
};

const goArticleAndComment = (articleId: string, title: string, type: string, info: string) => {
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
    <div class="text-center">
        <Loading :is-loading="isLoad" />
        <NoResult :is-display="isEmpty" />
        <div
            v-for="a in articleList"
            :key="a.articleId"
            v-if="!isLoad"
            class="flex flex-col p-5 dark:bg-dark bg-light hover:shadow-md shadow-sm mt-2 mx-2 rounded-md transition-all"
        >
            <div class="flex flex-row p-0 text-gray-400">
                <div class="truncate">
                    <span class="hover:text-blue-500 cursor-pointer transition-all">{{ a.author.username }} · </span>
                    <span v-text="formatTime(a.releaseTime)"></span>
                    <span class="hover:text-blue-500 cursor-pointer transition-all" v-for="t in a.tags" :key="t.tagId">
                        · {{ t.tagName }}</span
                    >
                </div>
            </div>
            <div class="flex flex-row m">
                <div class="my-2 flex flex-row align-middle">
                    <div class="text-left">
                        <span
                            :style="{ backgroundColor: tagBgColor(a.type) }"
                            class="px-2 py-[2px] mr-2 rounded-full m-auto transition-all type cursor-default dark:text-light"
                        >
                            {{ a.type }}
                        </span>
                        <span class="text-lg py-1 title" @click="handleToArticleDetail(a.type, a.articleId)">{{
                            a.title
                        }}</span>
                    </div>
                </div>
            </div>
            <div
                @click="handleToArticleDetail(a.type, a.articleId)"
                class="flex mb-4 mt-2 text-sm text-gray-500 text-left cursor-default"
            >
                {{ a.introduction }}
            </div>
            <div class="flex flex-row justify-start">
                <CommentsLink
                    :comments="a.comments"
                    @click="handleClickComment(a.articleId, a.title, a.type, a.introduction)"
                />
                <CollectionLink :id="a.articleId" :type="0" :collect-count="a.collect" />
                <ShareLink />
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
<style scoped>
.type {
    opacity: 0.9;
}
.type:hover {
    opacity: 1;
}
</style>
