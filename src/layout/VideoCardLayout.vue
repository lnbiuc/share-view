<script setup lang="ts">
const { articleId, images } = defineProps<{
    articleId: string;
    images: string;
}>();
</script>

<template>
    <div class="py-2" @click="$router.push({ path: '/v/' + articleId })">
        <div
            class="h-[400px] rounded-md shadow-md flex justify-center items-center video-preview"
            :style="{ background: 'url(' + images + ') center center no-repeat' }"
        >
            <el-icon
                size="100"
                color="rgb(155,163,175)"
                class="text-gray-300 play-btn cursor-pointer hover:text-gray-200 transition-all"
            >
                <i-ant-design-play-circle-outlined />
            </el-icon>
        </div>
    </div>
</template>
<style scoped>
.video-preview {
    background-size: cover !important;
}
</style>
