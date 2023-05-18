<template>
    <div class="flex flex-col justify-center items-center h-[60vh]">
        <span class="font-bold text-blue-400 text-[150px]">500</span>
        <span class="font-semibold dark:text-dark text-[30px] mt-6 mb-4">System Error</span>
        <span class="font-semibold dark:text-dark text-[20px] mb-6"
            >Oops! Something went wrong. Please try again later.</span
        >
        <el-button @click="$router.push('/i')" size="large">
            <el-icon :size="20"><i-ep-back /></el-icon>
            <span class="ml-4">Back To Home</span>
        </el-button>
    </div>
</template>
<script setup lang="ts"></script>
