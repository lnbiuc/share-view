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
    <div v-if="props.isLoading" class="flex flex-col justify-center items-center my-20">
        <el-icon :size="60" color="gray" class="animate-spin"><Loading /></el-icon>
        <span class="text-2xl mt-4 text-gray-500"> Loading, Please Wait! </span>
    </div>
</template>
