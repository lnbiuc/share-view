<script setup lang="ts">
import { useScreenSizeStore, useUserStore } from '../pinia';

const store = useUserStore();

const sizeStore = useScreenSizeStore();
</script>

<template>
    <WelcomeCard v-if="$route.path === '/i'" />
    <div
        class="text-center flex m-auto flex-row sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl"
        id="articleList"
    >
        <div class="flex flex-col w-full sm:w-full md:w-8/12 lg:w-8/12 xl:w-8/12" id="scrollContent_0">
            <SortBy v-if="$route.path !== '/c'" />
            <!--            <transition name="fade">-->
            <router-view />
            <!--            </transition>-->
        </div>
        <div
            class="flex flex-col w-full sm:w-full md:w-4/12 lg:w-4/12 xl:w-4/12 hidden sm:hidden md:flex lg:flex xl:flex"
        >
            <el-affix :offset="0" target="#scrollContent_0">
                <UserInfo v-if="store.isLogin" :user="store.user" :count="store.count" />
                <OptionMenu class="hidden md:flex" />
            </el-affix>
        </div>
    </div>
</template>
