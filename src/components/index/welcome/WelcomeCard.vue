<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useScreenSizeStore, useThemeStore } from '../../../pinia';

const toGithub = (url: string) => {
    window.open(url, '_blank');
};

const themeStore = useThemeStore();
const refThemeStore = storeToRefs(themeStore);
const isDark = ref<boolean>(false);
watch(refThemeStore.isDark, () => {
    isDark.value = refThemeStore.isDark.value;
});
onMounted(() => {
    const theme = localStorage.getItem('vueuse-color-scheme');
    isDark.value = theme === 'dark';
});

const getStart = () => {
    const el = document.getElementById('articleList');
    window.scroll({ behavior: 'smooth', top: el?.offsetTop });
};

const sizeStore = useScreenSizeStore();
</script>

<template>
    <div class="flex-row justify-center m-[20px] flex px-0 sm:p-2 md:mt-[100px] md:h-[500px]">
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
                <el-button plain bg color="#626aef" :dark="themeStore.isDark" type="primary" @click="getStart"
                    >Get Start</el-button
                >
                <div
                    class="flex flex-row items-center ml-4 cursor-pointer"
                    @click="toGithub('https://github.com/lnbiuc/share-view')"
                >
                    <span class="text-base text-gray-500 hover:text-blue-500 transition-all mr-2">
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
        <div v-if="sizeStore.isPC">
            <img v-show="isDark" src="../../../assets/main-card-dark.svg" alt="card" class="welcome-svg" />
            <img v-show="!isDark" src="../../../assets/main-card-light.svg" alt="card" class="welcome-svg" />
        </div>
    </div>
</template>
<style>
.check-list {
    @apply flex flex-row text-base dark:text-gray-300;
}

.welcome-svg {
    @apply w-10/12 flex flex-col items-center justify-center;
}
</style>
