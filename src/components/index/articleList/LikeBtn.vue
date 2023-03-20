<script setup lang="ts">
import { likeArticle } from '../../../axios/api/likesApi';
import { ElMessage } from 'element-plus';

const props = defineProps({
    type: {
        type: Number,
        default: -1,
    },
    id: {
        type: String,
        default: '',
    },
});
const handledLikeClick = (isLike: number) => {
    if (props.type !== -1 && props.id !== '') {
        likeArticle(props.id, props.type, isLike).then((res) => {
            if (res.data.code == 200) {
                ElMessage.success('SUCCESS');
            } else {
                ElMessage.warning(res.data.message);
            }
        });
    }
};
</script>

<template>
    <div class="flex flex-row">
        <el-button-group>
            <el-button @click="handledLikeClick(1)" plain type="primary">
                Like
                <el-icon :size="20">
                    <i-ep-caret-top />
                </el-icon>
            </el-button>
            <el-button @click="handledLikeClick(0)" plain type="primary">
                <el-icon :size="20"><i-ep-caret-bottom /></el-icon>
            </el-button>
        </el-button-group>
    </div>
</template>
