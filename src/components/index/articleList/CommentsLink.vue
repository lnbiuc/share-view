<template>
    <div class="px-2 flex flex-row items-center text-sm">
        <el-icon color="gray"><ChatDotRound /></el-icon>
        <span class="mx-2 text-gray-500">{{ comments }}</span>
        <span class="hover:text-blue-500 transition-all text-gray-400 cursor-pointer">Comments</span>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { ChatDotRound } from '@element-plus/icons-vue';

const props = defineProps({
    comments: {
        type: Number,
        default: 0,
    },
});
</script>
