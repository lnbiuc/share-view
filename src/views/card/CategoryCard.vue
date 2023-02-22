<script setup lang="ts">
import { CategoryEntity, getCategoryList } from '../../axios/api/categoryApi';
import { formatTime } from '../../utils';
import { ref } from 'vue';

const data = ref<CategoryEntity[]>([
    {
        'id': 0,
        'name': '',
        // @ts-ignore
        'author': {
            'userId': '',
            'username': '',
            'signature': '',
            'avatar': '',
            'level': 0,
            'ipAddr': '',
        },
        'introduction': '',
        'avatar': '',
        'createTime': '',
    },
]);
const isLoading = ref<boolean>(true);
getCategoryList(1, 10).then((res) => {
    data.value = res.data.data.data;
    isLoading.value = false;
});
</script>

<template>
    <Loading :is-loading="isLoading" />
    <div class="m-2" v-if="!isLoading">
        <div
            v-for="a in data"
            :key="a.id"
            class="flex flex-row mb-2 bg-white transition-all dark:bg-dark rounded-md shadow-sm hover:shadow-md p-4"
        >
            <div class="flex flex-col justify-center items-center">
                <el-avatar class="mb-4 shadow-sm" :size="100" shape="square" :src="a.avatar" />
                <el-button>Subscribe</el-button>
            </div>
            <div class="flex flex-col ml-4 justify-center">
                <span
                    class="text-left font-semibold text-xl mb-2 hover:text-blue-500 cursor-pointer transition-all"
                    @click="$router.push({ path: '/c/' + a.id })"
                    >{{ a.name }}</span
                >
                <span class="text-gray-500 text-left mb-2">{{ a.introduction }}</span>
                <span class="text-left text-gray-500 text-sm mb-2">
                    Create In
                    <el-tooltip :content="a.createTime">
                        <span class="cursor-pointer">
                            {{ formatTime(a.createTime) }}
                        </span>
                    </el-tooltip>
                    By
                    <span
                        class="hover:text-blue-500 cursor-pointer transition-all"
                        @click="$router.push({ path: '/a/' + a.author.userId })"
                    >
                        {{ a.author.username }}
                    </span>
                </span>
                <div class="flex flex-row text-gray-500">
                    <span class="mr-2">Article:10</span>
                    <span class="mr-2">Question:20</span>
                    <span class="mr-2">Post:15</span>
                    <span class="mr-2">Video:5</span>
                </div>
            </div>
        </div>
    </div>
</template>
