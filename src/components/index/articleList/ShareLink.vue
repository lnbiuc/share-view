<script setup lang="ts">
import { ElNotification } from 'element-plus';

const { articleType, articleId } = defineProps({
    articleType: {
        type: String,
        default: 'Article',
    },
    articleId: {
        type: String,
        default: '',
    },
});

import { useClipboard } from '@vueuse/core';

const source = ref('Hello');
const { text, copy, copied, isSupported } = useClipboard({ source });
const handleCopyLink = () => {
    let typeStr = '';
    if (articleType === 'Article') {
        typeStr = 'a';
    } else if (articleType === 'Question') {
        typeStr = 'q';
    } else if (articleType === 'Post') {
        typeStr = 'p';
    } else if (articleType === 'Video') {
        typeStr = 'v';
    }
    source.value = `https://share.vio.vin/${typeStr}/${articleId}`;
    if (!isSupported) {
        ElNotification({
            title: 'Warning',
            message: h('span', null, [
                'Your browser does not support automatic copy, please manually copy the link',
                h('br'),
            ]),
        });
        return;
    }
    copy();
    ElNotification({
        message: 'Link copied',
        type: 'success',
    });
};
</script>

<template>
    <div class="px-2 flex flex-row items-center text-sm" @click="handleCopyLink">
        <div class="flex flex-row justify-center">
            <el-icon color="rgb(156, 163, 175)" :size="18">
                <i-ant-design-share-alt-outlined />
            </el-icon>
        </div>
        <span class="hover:text-blue-500 ml-1 transition-all text-gray-400 cursor-pointer">Share</span>
    </div>
</template>
