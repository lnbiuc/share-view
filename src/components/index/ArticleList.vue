<template>
    <div class="text-center">
        <div
            v-for="a in articleList"
            :key="a.articleId"
            class="flex flex-col p-5 bg-white hover:shadow-md shadow-sm m-2 rounded-md transition-all"
        >
            <div class="flex flex-row text-gray-400">
                <p class="truncate">
                    <span
                        >{{ a.author.username }} ·
                        <span v-text="formatTime(a.releaseTime)"></span>
                    </span>
                    <span v-for="t in a.tags" :key="t.tagId"> · {{ t.tagName }}</span>
                </p>
            </div>
            <div class="flex flex-row m">
                <div class="my-2 flex flex-row align-middle">
                    <div
                        class="mr-2 rounded-full m-auto"
                        :style="{ backgroundColor: tagBgColor(a.type) }"
                        style="width: 80px"
                    >
                        {{ a.type }}
                    </div>
                    <div class="text-lg">{{ a.title }}</div>
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
import { ref } from 'vue';
import { format } from 'timeago.js';
import ShareLink from './articleList/ShareLink.vue';
import CollectionLink from './articleList/CollectionLink.vue';
import CommentsLink from './articleList/CommentsLink.vue';
const props = defineProps({
    articleList: {
        type: Object,
        default: {},
    },
});

const formatTime = (time: string) => {
    return format(time, 'zh_CN');
};
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
