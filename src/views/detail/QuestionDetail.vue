<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';

const articleId = useRouteParams<string>('articleId');
</script>

<template>
    <h1>question</h1>
</template>
