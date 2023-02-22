<script setup lang="ts">
import { ViewHistoryEntity } from '../../axios/api/articleApi';
import { formatTime } from '../../utils';
// @ts-ignore
import { User } from '@element-plus/icons-vue';

const prop = defineProps({
    historyList: {
        type: Array<ViewHistoryEntity>,
    },
});
</script>
<template>
    <div class="flex flex-col bg-white mt-2 dark:bg-dark rounded-md hover:shadow-md transition-all shadow-sm p-3">
        <div
            v-for="a in historyList"
            class="my-1 px-2 py-1 rounded-md transition-all"
        >
            <div class="flex flex-row justify-start">
                <span
                    class="hover:text-blue-500 text-gray-600 transition-all cursor-pointer truncate text-sm"
                    @click="$router.push({ path: '/a/' + a.articleId })"
                    >{{ a.title }}</span
                >
            </div>
            <div class="flex flex-row justify-start text-md text-gray-400 truncate text-xs">
                <span class="text-left my-1">{{ a.introduction }}</span>
            </div>
            <div class="flex flex-row justify-between text-sm text-gray-400">
                <span class="hover:text-blue-400 transition-all cursor-pointer"
                    ><el-icon><User /></el-icon> {{ a.author.username }}</span
                >
                <el-tooltip class="box-item" effect="dark" :content="a.time" placement="bottom-end">
                    <span class="cursor-pointer" v-text="formatTime(a.time)"></span>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>
