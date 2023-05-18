<template>
    <div class="flex flex-col justify-center items-center h-[60vh]">
        <span class="font-bold text-blue-400 text-[150px]">404</span>
        <span class="font-semibold dark:text-dark text-[30px] mt-6 mb-4">Not Found</span>
        <span class="font-semibold dark:text-dark text-[20px] mb-6"
            >The requested URL was not found on this server.</span
        >
        <el-button @click="$router.push('/i')" size="large">
            <el-icon :size="20"><i-ep-back /></el-icon>
            <span class="ml-4">Back To Home</span>
        </el-button>
    </div>
</template>
