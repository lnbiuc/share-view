<template>
    <div class="px-2 flex flex-row items-center">
        <el-icon><Comment /></el-icon>
        <span class="mx-2">{{ comments }}</span>
        <span>Comments</span>
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
