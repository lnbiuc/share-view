<script setup lang="ts">
// @ts-ignore
import { CaretTop, CaretBottom } from '@element-plus/icons-vue'
</script>

<template>
    <div class="flex flex-row">
        <span class="flex items-center text-blue-500 font-medium rounded-md bg-blue-100 hover:bg-blue-200 transition-all py-1 px-2 cursor-pointer"> Like<el-icon :size="20"><CaretTop /></el-icon></span>
        <span class="flex items-center text-blue-500 font-medium rounded-md bg-blue-100 hover:bg-blue-200 transition-all py-1 px-2 cursor-pointer mx-1"><el-icon><CaretBottom /></el-icon></span>
    </div>
</template>

