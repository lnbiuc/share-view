<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { useRouter } from 'vue-router';

const userId = useRouteParams<string>('userId');
onMounted(() => {
    const router = useRouter();
    router.push('/u/p/like/article/' + userId.value);
});
</script>

<template>
    <div>
        <div class="border-light dark:border-dark p-4 dark:bg-dark rounded-md mx-2 mt-2">
            <el-menu router default-active="1" class="el-menu-demo-like" id="menu2" mode="horizontal">
                <el-menu-item index="1" :route="'/u/p/like/article/' + userId">Article</el-menu-item>
                <el-menu-item index="2" :route="'/u/p/like/comment/' + userId">Comment</el-menu-item>
                <el-menu-item index="3" :route="'/u/p/like/answer/' + userId">Answer</el-menu-item>
            </el-menu>
        </div>
        <router-view />
    </div>
</template>
