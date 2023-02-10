<template>
    <div class="flex flex-col bg-white mt-2 rounded-md hover:shadow-md transition-all shadow-sm p-3">
        <div class="flex justify-start items-center">
            <el-icon color="#409eff">
                <UserFilled /> </el-icon
            >&nbsp;
            <span class="mx-1">Creation Center</span>
        </div>
        <div class="flex flex-row my-6">
            <div v-for="b in btn" class="flex flex-col w-20 items-center">
                <div :style="styObject(b.index)" class="p-2 m-1 rounded-full img">
                    <img class="w-6 h-6" :src="b.img" alt="" />
                </div>
                <span class="text-xs">{{ b.name }}</span>
            </div>
        </div>
        <div class="flex flex-row rounded-md bg-gray-100 justify-around">
            <div class="flex flex-col m-2 p-2">
                <span class="text-gray-500">Today Views</span>
                <span class="text-lg mt-2">42</span>
            </div>
            <div class="flex flex-col m-2 p-2">
                <span class="text-gray-500">Today Likes</span>
                <span class="text-lg mt-2">20</span>
            </div>
        </div>
        <div
            class="mt-2 p-2 border-blue-400 border rounded-md cursor-pointer transition-all flex items-center hover:bg-blue-100"
        >
            <span class="text-center m-auto align-middle text-blue-400">
                Enter Creation Center
                <el-icon><ArrowRight /></el-icon>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../../pinia';
// @ts-ignore
import { UserFilled, ArrowRight } from '@element-plus/icons-vue';
const store = useUserStore();
const btn = [
    {
        index: 0,
        img: '../../../src/assets/icon/file_done.svg',
        name: 'Answer Question',
        bg: '#c6e2ff',
        hover: '#a0cfff',
    },
    {
        index: 1,
        img: '../../../src/assets/icon/video.svg',
        name: 'Upload Video',
        bg: '#f8e3c5',
        hover: '#f3d19e',
    },
    {
        index: 2,
        img: '../../../src/assets/icon/edit-square.svg',
        name: 'Publish Article',
        bg: '#fcd3d3',
        hover: '#fab6b6',
    },
    {
        index: 3,
        img: '../../../src/assets/icon/rest.svg',
        name: 'Send Post',
        bg: '#d1edc4',
        hover: '#b3e19d',
    },
];

const styObject = (index: number) => {
    return {
        '--background-color': btn[index].bg,
        '--background-color-hover': btn[index].hover,
    };
};
</script>
<style scoped>
.img {
    background-color: var(--background-color);
    transition: all 0.2s ease;
}

.img:hover {
    background-color: var(--background-color-hover);
    transition: all 0.2s ease;
}
</style>
