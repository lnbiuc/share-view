<script setup lang="ts">
const props = defineProps({
    total: {
        type: Number,
        default: 0,
    },
    pageSize: {
        type: Number,
        default: 0,
    },
    currentPage: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(['numberChange']);

const currentChange = (pageNumber: number) => {
    emit('numberChange', pageNumber);
};
</script>

<template>
    <div class="mt-4 mb-2 flex flex-row justify-center">
        <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            @current-change="currentChange"
            layout="prev, pager, next"
            :total="total"
            hide-on-single-page
        />
    </div>
</template>
