<script setup lang="ts">
// @ts-ignore
import { Share } from '@element-plus/icons-vue';
</script>

<template>
    <div class="px-2 flex flex-row items-center text-sm">
        <div class="flex flex-row justify-center">
            <el-icon color="gray" size="17"> <i-material-symbols-share /> </el-icon>
        </div>
        <span class="hover:text-blue-500 ml-1 transition-all text-gray-400 cursor-pointer">Share</span>
    </div>
</template>
