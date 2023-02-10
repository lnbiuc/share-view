<template>
    <div class="px-2 flex flex-row items-center">
        <el-icon color="gray"><Comment /></el-icon>
        <span class="mx-2 text-gray-500">{{ comments }}</span>
        <span class="hover:text-blue-500 transition-all cursor-pointer">Comments</span>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { Comment } from '@element-plus/icons-vue';

const props = defineProps({
    comments: {
        type: Number,
        default: 0,
    },
});
</script>
