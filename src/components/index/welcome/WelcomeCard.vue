<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useThemeStore } from '../../../pinia';
import { ElMessage } from 'element-plus';
import { useScroll } from '@vueuse/core';

const toGithub = (url: string) => {
    window.open(url, '_blank');
};

const themeStore = storeToRefs(useThemeStore());
const isDark = ref<boolean>(false);
watch(themeStore.isDark, () => {
    isDark.value = themeStore.isDark.value;
});
onMounted(() => {
    const theme = localStorage.getItem('vueuse-color-scheme');
    isDark.value = theme === 'dark';
});

const getStart = () => {
    const el = document.getElementById('articleList');
    window.scroll({ behavior: 'smooth', top: el?.offsetTop });
};
</script>

<template>
    <div class="flex flex-row justify-between sm:w-full md:w-10/12 lg:w-8/12 xl:w-6/12 m-auto h-[600px] mt-[150px]">
        <div class="flex flex-col">
            <span class="text-[60px] font-semibold text-blue-500 my-5"> Share </span>
            <span class="text-[30px] font-semibold text-blue-400"> A web-based knowledge sharing platform </span>
            <div class="flex flex-col my-8">
                <span class="check-list">
                    <el-icon size="32" color="rgb(59, 130, 246)">
                        <i-material-symbols-check-small />
                    </el-icon>
                    Improve your reading with our product.
                </span>
                <span class="check-list">
                    <el-icon size="32" color="rgb(59, 130, 246)">
                        <i-material-symbols-check-small />
                    </el-icon>
                    Get fast search results with our product.
                </span>
                <span class="check-list">
                    <el-icon size="32" color="rgb(59, 130, 246)">
                        <i-material-symbols-check-small />
                    </el-icon>
                    Share your content in more ways.
                </span>
                <span class="check-list">
                    <el-icon size="32" color="rgb(59, 130, 246)">
                        <i-material-symbols-check-small />
                    </el-icon>
                    Use markdown syntax for better writing.
                </span>
                <span class="check-list">
                    <el-icon size="32" color="rgb(59, 130, 246)">
                        <i-material-symbols-check-small />
                    </el-icon>
                    Our product looks beautiful.
                </span>
            </div>
            <div class="flex flex-row ml-3 mb-4">
                <el-button type="primary" size="large" @click="getStart">Get Start</el-button>
                <div
                    class="flex flex-row items-center ml-4 cursor-pointer"
                    @click="toGithub('https://github.com/lnbiuc/share-view')"
                >
                    <span class="text-xl text-gray-500 hover:text-blue-500 transition-all">
                        View this project in Github
                    </span>
                    <el-tooltip content="https://github.com/lnbiuc/share-view">
                        <el-icon size="20" color="gray">
                            <i-material-symbols-open-in-new />
                        </el-icon>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <div>
            <img
                v-show="isDark"
                src="../../../assets/main-card-dark.svg"
                alt="card"
                style="position: relative; top: -50px"
            />
            <img
                v-show="!isDark"
                src="../../../assets/main-card-light.svg"
                alt="card"
                style="position: relative; top: -50px"
            />
        </div>
    </div>
</template>
<style>
.check-list {
    @apply flex flex-row text-xl;
}
</style>
