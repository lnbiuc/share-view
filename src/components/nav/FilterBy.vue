<script setup lang="ts">
const currentSelect = ref<number>(0);

const selectedStyle = (index: number) => {
    if (currentSelect.value == index) {
        return {
            color: '#1890ff',
        };
    }
};

const clickSelect = (index: number) => {
    currentSelect.value = index;
};

const currentSort = ref<number>(0);
</script>

<template>
    <div
        class="flex flex-row justify-between items-center rounded-md mx-2 mt-2 p-2 dark:bg-dark border-light hover:shadow-md transition"
    >
        <div class="flex flex-row">
            <span @click="clickSelect(0)" class="ml-2 cursor-pointer transition" :style="selectedStyle(0)">Post</span>
            <span @click="clickSelect(1)" class="mx-2 cursor-pointer transition" :style="selectedStyle(1)"
                >Comment</span
            >
            <span @click="clickSelect(2)" class="cursor-pointer transition" :style="selectedStyle(2)">Like</span>
        </div>
        <div>
            <el-select v-model="currentSort" class="w-[80px]">
                <el-option :value="0" label="Hot" @click="currentSort = 0">Hot</el-option>
                <el-option :value="1" label="New" @click="currentSort = 1">New</el-option>
            </el-select>
        </div>
    </div>
</template>
