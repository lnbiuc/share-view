<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { useCategoryAndTagsStore } from './pinia';

const categoryAndTagsStore = useCategoryAndTagsStore();
categoryAndTagsStore.refreshCategory();
categoryAndTagsStore.refreshTags();
</script>

<template>
    <router-view class="bg-light-white dark:bg-dark-black" />
</template>

<style>
html,
body {
    margin: 0;
    padding: 0;
}

#nprogress .bar {
    background: #409eff !important;
    height: 3px !important;
}

a {
    text-decoration: none;
}
</style>
