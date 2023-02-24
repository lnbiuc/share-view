<script setup lang="ts">
import { useDialogControlStore, useUserStore } from '../../pinia';
// @ts-ignore
import { UserFilled, ArrowRight } from '@element-plus/icons-vue';
import router from '../../router';
import { storeToRefs } from 'pinia';
const store = useUserStore();
const btn = [
    {
        index: 0,
        icon: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path d="m199.04 672.64 193.984 112 224-387.968-193.92-112-224 388.032zm-23.872 60.16 32.896 148.288 144.896-45.696L175.168 732.8zM455.04 229.248l193.92 112 56.704-98.112-193.984-112-56.64 98.112zM104.32 708.8l384-665.024 304.768 175.936L409.152 884.8h.064l-248.448 78.336L104.32 708.8zm384 254.272v-64h448v64h-448z" fill="dodgerblue"></path></svg>',
        name: 'Ask Questions',
        bg: '#c6e2ff',
        hover: '#a0cfff',
    },
    {
        index: 1,
        icon: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="orange" d="M704 768V256H128v512h576zm64-416 192-96v512l-192-96v128a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V224a32 32 0 0 1 32-32h640a32 32 0 0 1 32 32v128zm0 71.552v176.896l128 64V359.552l-128 64zM192 320h192v64H192v-64z"></path></svg>',
        name: 'Upload Video',
        bg: '#f8e3c5',
        hover: '#f3d19e',
    },
    {
        index: 2,
        icon: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="red" d="M832 384H576V128H192v768h640V384zm-26.496-64L640 154.496V320h165.504zM160 64h480l256 256v608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32zm160 448h384v64H320v-64zm0-192h160v64H320v-64zm0 384h384v64H320v-64z"></path></svg>',
        name: 'Publish Article',
        bg: '#fcd3d3',
        hover: '#fab6b6',
    },
    {
        index: 3,
        icon: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="green" d="M160 826.88 273.536 736H800a64 64 0 0 0 64-64V256a64 64 0 0 0-64-64H224a64 64 0 0 0-64 64v570.88zM296 800 147.968 918.4A32 32 0 0 1 96 893.44V256a128 128 0 0 1 128-128h576a128 128 0 0 1 128 128v416a128 128 0 0 1-128 128H296z"></path><path fill="currentColor" d="M352 512h320q32 0 32 32t-32 32H352q-32 0-32-32t32-32zm0-192h320q32 0 32 32t-32 32H352q-32 0-32-32t32-32z"></path></svg>',
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
const enterCreateCenter = () => {
    const store = useUserStore();
    if (store.isLogin) {
        router.push({ path: '/u/c/' + store.getUserId });
    } else {
        const dialogStore = useDialogControlStore();
        dialogStore.loginForm = true;
        const refStore = storeToRefs(store);
        watch(refStore.isLogin, async () => {
            if (refStore.isLogin) {
                await router.push({ path: '/u/c/' + store.getUserId });
            }
        });
    }
};
const dialogControlStore = useDialogControlStore();
const handleClick = (index: number) => {
    switch (index) {
        case 0:
            return (dialogControlStore.askQuestionForm.status = true);
        case 1:
            return console.log('upload vide form');
        case 2:
            return (dialogControlStore.publishArticleForm.status = true);
        case 3:
            return (dialogControlStore.sendPostForm.status = true);
    }
};
</script>
<template>
    <div class="flex flex-col bg-white mt-2 dark:bg-dark rounded-md hover:shadow-md transition-all shadow-sm p-3">
        <div class="flex justify-start items-center">
            <el-icon color="#409eff"> <UserFilled /> </el-icon>&nbsp;
            <span class="mx-1">Creation Center</span>
        </div>
        <div class="flex flex-row my-6">
            <div v-for="b in btn" :key="b.index" class="flex flex-col w-20 items-center">
                <div
                    :style="styObject(b.index)"
                    @click="handleClick(b.index)"
                    class="p-2 m-1 w-10 h-10 rounded-full img flex items-center justify-center"
                >
                    <i class="el-icon text-lg" style="zoom: 1.3" v-html="b.icon" />
                </div>
                <span class="text-xs">{{ b.name }}</span>
            </div>
        </div>
        <div class="flex flex-row rounded-md dark:bg-dark-black bg-gray-100 justify-around">
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
            class="mt-3 mx-0.5 p-2 border-blue-400 border rounded-md cursor-pointer transition-all flex items-center hover:bg-blue-100"
        >
            <span class="text-center m-auto align-middle text-blue-400" @click="enterCreateCenter">
                Enter Creation Center
                <el-icon><ArrowRight /></el-icon>
            </span>
        </div>
    </div>
</template>

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
