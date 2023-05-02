<script setup lang="ts">
import { ViewHistoryEntity } from '../../axios/api/articleApi';
import { formatTime } from '../../utils';
import { PropType } from 'vue';
import { useRouter } from 'vue-router';

const prop = defineProps({
    historyList: {
        type: Object as PropType<ViewHistoryEntity[]>,
        required: true,
    },
});
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
</script>
<template>
    <div class="flex flex-col bg-light mt-2 dark:bg-dark rounded-md hover:shadow-md transition-all shadow-sm p-2">
        <div class="flex justify-start items-center my-2 ml-1">
            <el-icon color="#409eff" :size="20">
                <i-ant-design-history-outlined />
            </el-icon>
            <span class="ml-2 dark:text-gray-300">View History</span>
        </div>
        <div v-for="a in historyList" :key="a.articleId" class="my-1 px-2 py-2 rounded-md transition-all">
            <div class="flex flex-row justify-start">
                <div
                    class="dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-500 transition-all cursor-pointer truncate text-sm"
                    @click="handleToArticleDetail(a.type, a.articleId)"
                >
                    <span v-if="a.type === 'Article' || a.type === 'Question'">{{ a.title }}</span>
                    <span v-if="a.type === 'Post' || a.type === 'Video'">{{ a.introduction }}</span>
                </div>
            </div>
            <div class="flex flex-row justify-between text-sm text-gray-400 mt-1">
                <div class="flex flex-row items-center hover:text-blue-400 transition-all cursor-pointer">
                    <el-icon color="rgb(156, 163, 175)" size="20" class="mr-1">
                        <i-mdi-user />
                    </el-icon>
                    <span @click="$router.push('/u/p/' + a.author.userId)">
                        {{ a.author.username }}
                    </span>
                </div>
                <el-tooltip class="box-item" effect="dark" :content="a.time" placement="bottom-end">
                    <span class="cursor-pointer text-xs" v-text="formatTime(a.time)"></span>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>
