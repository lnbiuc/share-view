<template>
    <div class="px-2 flex flex-row items-center">
        <img src="../../../assets/icon/comments.svg" class="w-4 h-4" alt="" />
        <span class="mx-2">{{ comments }}</span>
        <span>Comments</span>
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

<style scoped></style>
