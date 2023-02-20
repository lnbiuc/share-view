<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { storeToRefs } from "pinia";
import { useThemeStore } from "./pinia";

const themeStore = storeToRefs(useThemeStore());
watch(themeStore.isDark, () => {
    const el = document.getElementById('markdown');
    if (!el) {
        return
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
onMounted(() => {
    const el = document.getElementById('markdown');
    const theme = localStorage.getItem('vueuse-color-scheme');
    if (!el) {
        return
    }
    if (theme && theme == 'dark') {
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
})
</script>

<template>
    <router-view class="bg-gray-100 dark:bg-dark-black" />
</template>

<style>
html,
body {
    margin: 0;
    padding: 0;
}

#nprogress .bar {
    background: #6a67ce !important;
    height: 3px !important;
}

a {
    text-decoration: none;
}
</style>
