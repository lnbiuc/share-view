<template>
    <div class="text-center">
        <div
            v-for="a in articleList"
            :key="a.articleId"
            class="flex flex-col p-5 bg-white hover:shadow-md shadow-sm m-2 rounded-md transition-all"
        >
            <div class="flex flex-row text-gray-400">
                <p class="truncate">
                    <span class="hover:text-blue-500 cursor-pointer transition-all">{{ a.author.username }} · </span>
                    <span v-text="formatTime(a.releaseTime)"></span>
                    <span class="hover:text-blue-500 cursor-pointer transition-all" v-for="t in a.tags" :key="t.tagId">
                        · {{ t.tagName }}</span
                    >
                </p>
            </div>
            <div class="flex flex-row m">
                <div class="my-2 flex flex-row align-middle">
                    <div
                        class="mr-2 rounded-full m-auto transition-all type cursor-pointer"
                        :style="{ backgroundColor: tagBgColor(a.type) }"
                        style="width: 80px"
                    >
                        {{ a.type }}
                    </div>
                    <div
                        class="text-lg hover:text-blue-500 cursor-pointer transition-all"
                        @click="$router.push({ path: '/a/' + a.articleId })"
                    >
                        {{ a.title }}
                    </div>
                </div>
            </div>
            <div class="flex mb-4 text-gray-500 truncate">
                {{ a.introduction }}
            </div>
            <div class="flex flex-row justify-start">
                <CommentsLink :comments="a.comments" />
                <ShareLink />
                <CollectionLink />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ShareLink from './articleList/ShareLink.vue';
import CollectionLink from './articleList/CollectionLink.vue';
import CommentsLink from './articleList/CommentsLink.vue';
import { ArticleListEntity } from '../../api/article/articleApi';
import { formatTime } from "../../utils";

const props = defineProps({
    articleList: {
        type: Array<ArticleListEntity>,
    },
});
const tagBgColor = (type: string) => {
    switch (type) {
        case 'Post':
            return '#eebe77';
        case 'Question':
            return '#95d475';
        case 'Article':
            return '#79bbff';
    }
};
</script>
<style scoped>
.type {
    opacity: 0.9;
}
.type:hover {
    opacity: 1;
}
</style>
