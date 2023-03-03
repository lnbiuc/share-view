<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useThemeStore } from '../../../pinia';
import { ElMessage } from 'element-plus';

const toGithub = (url: string) => {
    window.open(url, '_blank');
};

const themeStore = storeToRefs(useThemeStore());
const isDark = ref<boolean>(false);
watch(themeStore.isDark, () => {
    if (themeStore.isDark.value) {
        isDark.value = true;
    } else {
        isDark.value = false;
    }
});
onMounted(() => {
    const theme = localStorage.getItem('vueuse-color-scheme');
    if (theme === 'dark') {
        isDark.value = true;
    } else {
        isDark.value = false;
    }
});
</script>

<template>
    <div class="flex flex-row justify-between sm:w-full md:w-10/12 lg:w-8/12 xl:w-6/12 m-auto mainCard mt-[150px]">
        <div class="flex flex-col">
            <span class="text-[60px] font-semibold text-blue-500 my-5"> Share </span>
            <span class="text-[30px] font-semibold text-blue-400"> A web-based knowledge sharing platform </span>
            <div class="flex flex-col my-8">
                <span class="check-list">
                    <el-icon size="32" color="rgb(59, 130, 246)">
                        <i-material-symbols-check-small />
                    </el-icon>
                    Better reading experience
                </span>
                <span class="check-list">
                    <el-icon size="32" color="rgb(59, 130, 246)">
                        <i-material-symbols-check-small />
                    </el-icon>
                    Faster content finding
                </span>
                <span class="check-list">
                    <el-icon size="32" color="rgb(59, 130, 246)">
                        <i-material-symbols-check-small />
                    </el-icon>
                    More ways to share
                </span>
                <span class="check-list">
                    <el-icon size="32" color="rgb(59, 130, 246)">
                        <i-material-symbols-check-small />
                    </el-icon>
                    Better markdown syntax support
                </span>
                <span class="check-list">
                    <el-icon size="32" color="rgb(59, 130, 246)">
                        <i-material-symbols-check-small />
                    </el-icon>
                    More beautiful appearance
                </span>
            </div>
            <div class="flex flex-row ml-3 mb-4">
                <el-button type="primary" size="large">Get Start</el-button>
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
    @apply flex flex-row text-xl h-10;
}

.mainCard {
    height: 700px;
}
</style>
