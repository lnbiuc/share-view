<script setup lang="ts">
import { ViewHistoryEntity } from '../../axios/api/articleApi';
import { formatTime } from '../../utils';
import { PropType } from 'vue';

const prop = defineProps({
    historyList: {
        type: Object as PropType<ViewHistoryEntity[]>,
        required: true,
    },
});
</script>
<template>
    <div class="flex flex-col bg-light mt-2 dark:bg-dark rounded-md hover:shadow-md transition-all shadow-sm p-2">
        <div v-for="a in historyList" class="my-1 px-2 py-2 rounded-md transition-all">
            <div class="flex flex-row justify-start">
                <span
                    class="dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-500 transition-all cursor-pointer truncate text-sm"
                    @click="$router.push({ path: '/a/' + a.articleId })"
                    >{{ a.title }}</span
                >
            </div>
            <div class="flex flex-row justify-between text-sm text-gray-400 mt-1">
                <div class="flex flex-row items-center hover:text-blue-400 transition-all cursor-pointer">
                    <el-icon color="rgb(156, 163, 175)" size="20" class="mr-1">
                        <i-mdi-user />
                    </el-icon>
                    <span>
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
