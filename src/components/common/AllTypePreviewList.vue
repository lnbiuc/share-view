<script setup lang="ts">
import { formatTime, handleClickComment, handleToArticleDetail, tagBgColor } from '../../utils';
import { ArticleListEntity, ViewHistoryEntity } from '../../axios/api/articleApi';
import VideoCardLayout from '../../layout/VideoCardLayout.vue';
import ImageGirdLayout from '../../layout/ImageGirdLayout.vue';
import { PropType } from 'vue';

const { articleList, viewTime } = defineProps({
    articleList: {
        type: Array as PropType<ArticleListEntity[]>,
        required: true,
    },
    viewTime: {
        type: Array as PropType<ViewHistoryEntity[]>,
        required: false,
    },
});
</script>

<template>
    <div
        v-for="(a, index) in articleList"
        :key="a.articleId"
        class="flex flex-col p-5 dark:bg-dark bg-light hover:shadow-md shadow-sm mt-2 mx-2 rounded-md transition-all flex-grow"
    >
        <div class="flex flex-row p-0 justify-between text-gray-400">
            <div class="truncate">
                <span
                    class="hover:text-blue-500 cursor-pointer transition-all"
                    @click="$router.push('/u/p/' + a.author.userId)"
                    >{{ a.author.username }} ·
                </span>
                <span class="text-sm" v-text="formatTime(a.releaseTime)"></span>
                <span class="hover:text-blue-500 cursor-pointer transition-all" v-for="t in a.tags" :key="t.tagId">
                    · {{ t.tagName }}</span
                >
            </div>
            <div>
                <el-dropdown trigger="click">
                    <el-button class="el-dropdown-link" text bg type="info">
                        <el-icon :size="20">
                            <i-ep-more />
                        </el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>Delete</el-dropdown-item>
                            <el-dropdown-item>Hidden</el-dropdown-item>
                            <el-dropdown-item>Modify</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="my-2 flex flex-row items-start">
            <div
                :style="{ backgroundColor: tagBgColor(a.type) }"
                class="mt-0.5 w-[10px] px-2 py-1 text-sm font-medium rounded-md transition-all type cursor-default dark:text-light"
            >
                <span>
                    {{ a.type.substring(0, 1) }}
                </span>
            </div>
            <div
                class="flex flex-grow text-base title leading-7 ml-3"
                @click="handleToArticleDetail(a.type, a.articleId, $router)"
            >
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
        <div class="flex flex-col mt-2">
            <div class="flex flex-row justify-start">
                <CommentsLink
                    :comments="a.comments"
                    @click="handleClickComment(a.articleId, a.title, a.type, a.introduction, $router)"
                />
                <CollectionLink :id="a.articleId" :type="0" :collect-count="a.collect" />
                <ShareLink />
            </div>
            <div class="mt-4 flex dark:text-dark" v-if="viewTime">
                <span>{{ formatTime(viewTime[index].viewTime) }} · {{ viewTime[index].viewTime }}</span>
            </div>
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
