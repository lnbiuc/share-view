<script setup lang="ts">
import { Pointer, StarFilled, ChatLineRound, Finished, Clock, Bell } from '@element-plus/icons-vue';
import UserProfileLayout from '../../layout/UserProfileLayout.vue';
import { useRouteParams } from '@vueuse/router';
import { useRouter } from 'vue-router';

const userId = useRouteParams<string>('userId');

const router = useRouter();
</script>

<template>
    <user-profile-layout>
        <template #left>
            <el-affix :offset="10" target="#scrollContent_1">
                <div class="dark:bg-dark border-light dark:border-dark px-2 py-4 rounded-md overflow-hidden">
                    <div class="flex flex-row items-center justify-center h-[20px] mb-4">
                        <div class="flex flex-row items-center">
                            <span class="dark:text-dark"> MENU </span>
                        </div>
                    </div>
                    <el-menu default-active="1" id="menu1" class="el-menu-vertical-demo">
                        <el-menu-item index="1" @click="$router.push('/u/p/publish/' + userId)">
                            <el-icon>
                                <Finished />
                            </el-icon>
                            <template #title>Publish</template>
                        </el-menu-item>
                        <el-menu-item index="2" @click="$router.push('/u/p/comment/' + userId)">
                            <el-icon>
                                <ChatLineRound />
                            </el-icon>
                            <template #title>Comment</template>
                        </el-menu-item>
                        <el-menu-item index="3" @click="$router.push('/u/p/like/' + userId)">
                            <el-icon>
                                <Pointer />
                            </el-icon>
                            <template #title>Like</template>
                        </el-menu-item>
                        <el-menu-item index="4" @click="$router.push('/u/p/collect/' + userId)">
                            <el-icon>
                                <StarFilled />
                            </el-icon>
                            <template #title>Collection</template>
                        </el-menu-item>
                        <el-menu-item index="5" @click="$router.push('/u/p/history/' + userId)">
                            <el-icon>
                                <Clock />
                            </el-icon>
                            <template #title>History</template>
                        </el-menu-item>
                        <el-menu-item index="6" @click="$router.push('/u/p/subscribe/' + userId)">
                            <el-icon>
                                <Bell />
                            </el-icon>
                            <template #title>Subscribe</template>
                        </el-menu-item>
                    </el-menu>
                </div>
            </el-affix>
        </template>
        <template #right>
            <div id="scrollContent_1">
                <router-view />
            </div>
        </template>
    </user-profile-layout>
</template>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.el-menu {
    border-right: none;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: unset;
}
</style>
