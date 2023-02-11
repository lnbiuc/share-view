<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const articleId = ref<string | string[]>(route.params.articleId)
</script>

<template>
    <h1>article detail {{articleId}}</h1>
</template>

