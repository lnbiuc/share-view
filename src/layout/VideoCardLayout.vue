<script setup lang="ts">
const { articleId, images } = defineProps<{
    articleId: string;
    images: string;
}>();
</script>

<template>
    <div class="py-2" @click="$router.push({ path: '/v/' + articleId })">
        <div
            class="h-[300px] rounded-md shadow-md bg-cover flex justify-center items-center video-preview"
            :style="{ background: 'url(' + images + ') center center no-repeat' }"
        >
            <el-icon
                size="100"
                color="rgb(155,163,175)"
                class="text-gray-300 play-btn cursor-pointer hover:text-gray-200 transition-all"
            >
                <i-material-symbols-play-circle-outline />
            </el-icon>
        </div>
    </div>
</template>
