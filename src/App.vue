<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { storeToRefs } from 'pinia';
import { useThemeStore } from './pinia';
import { ElMessage } from 'element-plus';

const themeStore = storeToRefs(useThemeStore());
watch(themeStore.isDark, () => {
    const el = document.getElementsByName('markdown');
    el.forEach((el) => {
        if (!el) {
            return;
        }
        if (themeStore.isDark.value) {
            // @ts-ignore
            el.removeAttribute('class');
            // @ts-ignore
            el.classList.add('markdown-body-dark');
        } else {
            // @ts-ignore
            el.removeAttribute('class');
            // @ts-ignore
            el.classList.add('markdown-body-light');
        }
    });
});
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
