<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue';
const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div
        v-if="props.isLoading"
        class="fixed inset-0 flex justify-center items-center bg-gray-200 dark:bg-neutral-950 opacity-50"
    >
        <div class="h-full w-full z-50 flex flex-col justify-center items-center">
            <el-icon :size="60" color="gray" class="animate-spin"><Loading /></el-icon>
            <span class="text-2xl mt-4 text-gray-500"> Loading, Please Wait! </span>
        </div>
    </div>
</template>
