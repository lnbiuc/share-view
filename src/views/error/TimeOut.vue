<template>
    <div class="flex flex-col justify-center items-center h-[60vh]">
        <span class="font-bold text-blue-400 text-[150px]">Time Out</span>
        <span class="font-semibold dark:text-dark text-[30px] mt-6 mb-4">Request Time Out</span>
        <span class="font-semibold dark:text-dark text-[20px] mb-6"
            >Request timed out. Please check your network connection and try again later.</span
        >
        <el-button @click="$router.push('/i')" size="large">
            <el-icon :size="20"><i-ep-back /></el-icon>
            <span class="ml-4">Back To Home</span>
        </el-button>
    </div>
</template>
<script setup lang="ts"></script>
