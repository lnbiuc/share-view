<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const articleId = ref<string | string[]>(route.params.articleId)
console.log(articleId)
</script>

<template>
    <h1>article detail</h1>
</template>

