<template>
    <div
        class="flex flex-row hover:shadow-md shadow-sm transition-all py-2 m-2 rounded-full bg-white w-auto"
    >
        <div class="flex flex-1 justify-center">
            <div
                class="py-2 mx-20 hover:text-purple-400"
                @click="$router.push({ path: '/' })"
            >
                <span class="m-1 cursor-pointer">Share</span>
            </div>
        </div>
        <div class="flex flex-2 justify-center">
            <div
                v-for="nav in navs"
                :key="nav.name"
                @click="$router.push({ path: nav.path })"
                class="px-2 py-2 hover:bg-purple-300 hover:rounded-full transition-all cursor-pointer"
            >
                <span class="m-1">{{ nav.name }}</span>
            </div>
        </div>
        <div class="flex flex-1 justify-center">
            <div
                class="px-2 py-2 bg-purple-200 hover:bg-purple-300 rounded-full transition-all cursor-pointer"
            >
                <span class="m-2">Login / Register</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const navs = [
    {
        name: "Article",
        path: "/a",
    },
    {
        name: "Question",
        path: "/q",
    },
    {
        name: "Post",
        path: "/p",
    },
    {
        name: "Video",
        path: "/v",
    },
    {
        name: "Category",
        path: "/c",
    },
];
</script>

<style scoped></style>
