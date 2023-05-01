<script setup lang="ts">
import { likeArticle } from '../../../axios/api/likesApi';
import { ElMessage } from 'element-plus';
import { useThemeStore } from '../../../pinia';

const props = defineProps({
    type: {
        type: Number,
        default: -1,
    },
    id: {
        type: String,
        default: '',
    },
    like: {
        type: Number,
        default: 0,
    },
    dislike: {
        type: Number,
        default: 0,
    },
});
const handledLikeClick = (isLike: number) => {
    if (props.type !== -1 && props.id) {
        likeArticle(props.id, props.type, isLike).then((res) => {
            if (res.data.code == 200) {
                ElMessage.success('SUCCESS');
                if (isLike) {
                    emit('on-like-success');
                } else {
                    emit('on-dislike-success');
                }
            } else {
                ElMessage.warning(res.data.message);
            }
        });
    }
};

const emit = defineEmits(['on-like-success', 'on-dislike-success']);

const themeStore = useThemeStore();
</script>

<template>
    <div class="flex flex-row mr-2">
        <el-button-group>
            <el-button @click="handledLikeClick(1)" plain color="#626aef" :dark="themeStore.isDark">
                <span v-if="props.like > 0" class="mr-1">
                    {{ props.like }}
                </span>
                <el-icon :size="20" class="mr-1">
                    <i-ep-caret-top />
                </el-icon>
                <div class="text-sm">
                    <span> Like </span>
                </div>
            </el-button>
            <el-button @click="handledLikeClick(0)" plain color="#626aef" :dark="themeStore.isDark">
                <span v-if="props.dislike > 0" class="mr-1">
                    {{ props.dislike }}
                </span>
                <el-icon :size="20">
                    <i-ep-caret-bottom />
                </el-icon>
            </el-button>
        </el-button-group>
    </div>
</template>
