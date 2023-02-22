<script setup lang="ts">
import { likeArticle } from '../../../axios/api/likesApi';
import { ElMessage } from 'element-plus';

const props = defineProps({
    type: {
        type: Number,
        default: -1
    },
    id: {
        type: String,
        default: ''
    }
});
const handledLikeClick = (isLike:number) => {
    if (props.type !== -1 && props.id !== '') {
        likeArticle(props.id, props.type, isLike).then(res => {
            if (res.data.code == 200) {
                ElMessage.success('SUCCESS');
            } else {
                ElMessage.warning(res.data.message);
            }
        })
    }
}

</script>

<template>
    <div class="flex flex-row">
        <span
            class="flex items-center text-blue-500 font-medium rounded-md hover:shadow-sm bg-blue-100 hover:bg-blue-200 transition-all py-0.5 px-2 cursor-pointer"
            @click="handledLikeClick(1)"
        >
            Like<el-icon :size="20"><i-ep-caret-top/></el-icon
        ></span>
        <span
            class="flex items-center text-blue-500 font-medium rounded-md hover:shadow-sm bg-blue-100 hover:bg-blue-200 transition-all py-0.5 px-2 cursor-pointer mx-1"
            @click="handledLikeClick(0)"
        >
            <el-icon><i-ep-caret-bottom/></el-icon
        ></span>
    </div>
</template>
