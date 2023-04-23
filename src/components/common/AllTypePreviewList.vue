<script setup lang="ts">
import { formatTime, tagBgColor } from '../../utils';
import { ArticleListEntity } from '../../axios/api/articleApi';
import { useRouter } from 'vue-router';
import { useDialogControlStore, useUserStore } from '../../pinia';
import { storeToRefs } from 'pinia';
import VideoCardLayout from '../../layout/VideoCardLayout.vue';
import ImageGirdLayout from '../../layout/ImageGirdLayout.vue';

const { articleList } = defineProps<{
    articleList: ArticleListEntity[];
}>();

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
</script>

<template>
    <div
        v-for="a in articleList"
        :key="a.articleId"
        class="flex flex-col p-5 dark:bg-dark bg-light hover:shadow-md shadow-sm mt-2 mx-2 rounded-md transition-all"
    >
        <div class="flex flex-row p-0 text-gray-400">
            <div class="truncate">
                <span class="hover:text-blue-500 cursor-pointer transition-all">{{ a.author.username }} · </span>
                <span class="text-sm" v-text="formatTime(a.releaseTime)"></span>
                <span class="hover:text-blue-500 cursor-pointer transition-all" v-for="t in a.tags" :key="t.tagId">
                    · {{ t.tagName }}</span
                >
            </div>
        </div>
        <div class="my-2 flex flex-row items-start">
            <div
                :style="{ backgroundColor: tagBgColor(a.type) }"
                class="mt-0.5 w-[10px] px-[15px] py-[2px] text-sm font-medium rounded-sm transition-all type cursor-default dark:text-light"
            >
                <span>
                    {{ a.type.substring(0, 1) }}
                </span>
            </div>
            <div class="flex flex-grow text-base title leading-7 ml-3" @click="handleToArticleDetail(a.type, a.articleId)">
                <span v-if="a.type === 'Article' || a.type === 'Question'">
                    {{ a.title }}
                </span>
                <span v-if="a.type === 'Video' || a.type === 'Post'">
                    {{ a.introduction }}
                </span>
            </div>
        </div>
        <div
            v-if="a.type === 'Article' || a.type === 'Question'"
            class="flex text-xs text-gray-500 text-left cursor-default mb-1"
        >
            {{ a.introduction }}
        </div>
        <div v-if="a.type === 'Video'">
            <video-card-layout :images="a.images[0]" :article-id="a.articleId" />
        </div>
        <div v-if="a.type === 'Post'" class="mt-1">
            <image-gird-layout :images="a.images" />
        </div>
        <div class="flex flex-row justify-start mt-2">
            <CommentsLink
                :comments="a.comments"
                @click="handleClickComment(a.articleId, a.title, a.type, a.introduction)"
            />
            <CollectionLink :id="a.articleId" :type="0" :collect-count="a.collect" />
            <ShareLink />
        </div>
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
