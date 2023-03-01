<script setup lang="ts">
import { addCollection } from '../../../axios/api/collectApi';
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
    collectCount: {
        type: Number,
        default: 19,
    },
});

const handlerCollect = () => {
    if (props.type !== -1 && props.id !== '') {
        addCollection(props.id, props.type).then((res) => {
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
    <div class="px-2 flex flex-row items-center text-sm justify-center">
        <div class="flex flex-row justify-center items-start">
            <el-icon color="gray" size="17"><i-material-symbols-star /></el-icon>&nbsp;
        </div>
        <span class="mr-1 text-gray-400">{{ collectCount }}</span>
        <span class="hover:text-blue-500 transition-all text-gray-400 cursor-pointer" @click="handlerCollect"
            >Collect</span
        >
    </div>
</template>
