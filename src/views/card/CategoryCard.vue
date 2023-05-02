<script setup lang="ts">
import { CategoryEntity, getCategoryList } from '../../axios/api/categoryApi';
import { formatTime } from '../../utils';
import { Ref, ref } from 'vue';
import { useThemeStore } from '../../pinia';

const data: Ref<CategoryEntity[]> = ref([
    {
        id: 0,
        name: '',
        author: {
            userId: '',
            username: '',
            signature: '',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            level: 0,
            registerTime: '',
            lastLogin: '',
            ipAddr: '',
            isSubscribed: false,
        },
        introduction: '',
        avatar: '',
        createTime: '',
        articleCount: 0,
        questionCount: 0,
        postCount: 0,
        videoCount: 0,
    },
]);
const isLoading = ref<boolean>(true);

const getData = () => {
    getCategoryList(params.value.pageNumber, params.value.pageSize).then((res) => {
        data.value = res.data.data.data;
        params.value.total = res.data.data.total;
        isLoading.value = false;
    });
};

onMounted(() => {
    getData();
});

const params = ref<{ pageNumber: number; pageSize: number; total: number }>({ pageNumber: 1, pageSize: 10, total: 0 });

const categoryPageNumberChange = (pageNumber: number) => {
    params.value.pageNumber = pageNumber;
    getData();
};

const themeStore = useThemeStore();
</script>

<template>
    <Loading :is-loading="isLoading" />
    <transition>
        <div class="mx-2" v-if="!isLoading">
            <div
                v-for="a in data"
                :key="a.id"
                class="flex flex-row mt-2 bg-light transition-all dark:bg-dark rounded-md shadow-sm hover:shadow-md p-4"
            >
                <div class="flex flex-col justify-start items-start">
                    <el-avatar class="shadow-md" :size="140" shape="square" :src="a.avatar" />
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
                            @click="$router.push('/u/p/' + a.author.userId)"
                        >
                            {{ a.author.username }}
                        </span>
                    </span>
                    <div class="flex flex-row text-gray-500">
                        <span class="mr-2">Article : {{ a.articleCount }}</span>
                        <span class="mr-2">Question : {{ a.questionCount }}</span>
                        <span class="mr-2">Post : {{ a.postCount }}</span>
                        <span class="mr-2">Video : {{ a.videoCount }}</span>
                    </div>
                </div>
            </div>
            <Pagination
                :current-page="params.pageNumber"
                :page-size="params.pageSize"
                :total="params.total"
                @numberChange="categoryPageNumberChange"
            />
        </div>
    </transition>
</template>
