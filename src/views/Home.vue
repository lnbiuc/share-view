<script setup lang="ts">
import { useUserStore } from '../pinia';

const store = useUserStore();
</script>

<template>
    <WelcomeCard v-if="$route.path === '/i'" />
    <div
        class="text-center flex m-auto flex-row sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-2xl"
        id="articleList"
    >
        <div class="flex flex-col w-8/12" id="scrollContent_0">
            <SortBy v-if="$route.path !== '/c'" />
            <!--            <transition name="fade">-->
            <router-view />
            <!--            </transition>-->
        </div>
        <div class="flex flex-col w-4/12">
            <el-affix :offset="0" target="#scrollContent_0">
                <UserInfo v-if="store.isLogin" :user="store.user" :count="store.count" />
                <OptionMenu />
            </el-affix>
        </div>
    </div>
</template>
