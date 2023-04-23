<template>
    <div class="pr-2 flex flex-row items-center text-sm transition-all cursor-pointer">
        <el-icon color="rgb(156, 163, 175)" :size="18">
            <i-ant-design-message-twotone />
        </el-icon>
        <span class="mx-1 text-gray-400">{{ comments }}</span>
        <span class="hover:text-blue-500 transition-all text-gray-400 cursor-pointer">Comments</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    comments: {
        type: Number,
        default: 0,
    },
});
</script>
