<script setup lang="ts">
import { ref, Ref } from 'vue';
import { ArticleListEntity, articleParams, getViewHistory, ViewHistoryEntity } from '../../axios/api/articleApi';
import { useArticleParamsStore, useUserStore } from '../../pinia';
import { storeToRefs } from 'pinia';
import axios from '../../axios';
import { useRouteParams } from '@vueuse/router';
import UserProfileLayout from '../../layout/UserProfileLayout.vue';
import { Pointer, StarFilled, ChatLineRound, Finished, Clock } from '@element-plus/icons-vue';

const publishArticleList: Ref<ArticleListEntity[]> = ref([
    {
        articleId: '',
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
        title: '',
        introduction: '',
        type: '',
        tags: [],
        category: '',
        content: '',
        releaseTime: '',
        lastUpdate: '',
        setTop: false,
        views: 0,
        like: 0,
        collect: 0,
        comments: 0,
        images: [],
    },
]);

const historyList: Ref<ViewHistoryEntity[]> = ref([
    {
        articleId: '',
        viewTime: '',
        articleVo: {
            articleId: '',
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
            title: '',
            introduction: '',
            type: '',
            tags: [],
            category: '',
            content: '',
            releaseTime: '',
            lastUpdate: '',
            setTop: false,
            views: 0,
            like: 0,
            collect: 0,
            comments: 0,
            images: [],
        },
    },
]);

const convertToArticleList = ({ articleId, articleVo }: ViewHistoryEntity): ArticleListEntity[] => {
    const articleList: ArticleListEntity = { ...articleVo, articleId };
    return [articleList];
};

// const getViewTimeList = (history: ViewHistoryEntity): string[] => {
//     let timeList: string[] = [];
//     timeList.push(history.viewTime);
//     return timeList;
// };
const toViewTimeList = ({ viewTime }: ViewHistoryEntity): string[] => [viewTime];

const isEmpty = ref<boolean>(false);
watch(publishArticleList, () => {
    isEmpty.value = publishArticleList.value?.length == 0;
});

const getArticleList = async (data: articleParams) => {
    return axios.post('/api/article/page', data);
};

const total = ref<number>(0);
const isLoad = ref<boolean>(true);
const paramsStore = useArticleParamsStore();
paramsStore.filterTypeChange(0);
const userId = useRouteParams<string>('userId');
paramsStore.params.filterBy.authorId = userId.value;
onMounted(() => {
    getArticleList(paramsStore.params).then((res) => {
        publishArticleList.value = res.data.data.data;
        total.value = res.data.data.total;
        isLoad.value = false;
    });
});

// request when change
const refParamsStore = storeToRefs(paramsStore);
watch(refParamsStore.params.value, () => {
    getArticleList(paramsStore.params).then((res) => {
        publishArticleList.value = res.data.data.data;
        total.value = res.data.data.total;
        isLoad.value = false;
    });
});

const currentChange = (pageNumber: number): void => {
    const store = useArticleParamsStore();
    store.params.pageNumber = pageNumber;
    getArticleList(store.params).then((res) => {
        publishArticleList.value = res.data.data.data;
        isLoad.value = false;
        total.value = res.data.data.total;
    });
};

const userStore = useUserStore();

const getUserViewHistory = (pageNumber: number, pageSize: number): void => {
    isLoad.value = true;
    if (userStore.isLogin && userStore.user.userId === userId.value) {
        getViewHistory(userId.value, pageNumber, pageSize).then((res) => {
            isLoad.value = false;
            params.value.total = res.data.data.total;
            if (res.data.data.currentSize > 0) {
                historyList.value = res.data.data.data;
                isHost.value = true;
            } else {
                isHost.value = false;
            }
        });
    }
};
const isHost = ref<boolean>(false);

onMounted(() => {
    if (userStore.isLogin && userStore.user.userId === userId.value) {
        isHost.value = true;
    }
});

const params = ref<{ pageNumber: number; pageSize: number; total: number }>({ pageNumber: 1, pageSize: 10, total: 0 });

const historyCurrentChange = (pageNumber: number): void => {
    params.value.pageNumber = pageNumber;
    getUserViewHistory(params.value.pageNumber, params.value.pageSize);
};

// router change
watch(userId, () => {
    isLoad.value = true;
    paramsStore.params.filterBy.authorId = userId.value;
    getArticleList(paramsStore.params).then((res) => {
        publishArticleList.value = res.data.data.data;
        total.value = res.data.data.total;
        isLoad.value = false;
    });
    if (userId.value === userStore.user.userId) {
        isHost.value = true;
        getUserViewHistory(params.value.pageNumber, params.value.pageSize);
    } else {
        isHost.value = false;
    }
});

const isCollapse = ref<boolean>(false);

const currentDisplay = ref<number>(1);

const handleItemClick = (index: number): void => {
    if (currentDisplay.value !== index) {
        currentDisplay.value = index;
        isLoad.value = true;
        if (index === 1) {
            paramsStore.params.filterBy.authorId = userId.value;
        } else if (index === 2) {
            // TODO get comment
        } else if (index === 3) {
            // TODO get like
        } else if (index === 4) {
            // TODO get collect
        } else if (index === 5) {
            getUserViewHistory(params.value.pageNumber, params.value.pageSize);
        }
        getArticleList(paramsStore.params).then((res) => {
            publishArticleList.value = res.data.data.data;
            total.value = res.data.data.total;
            isLoad.value = false;
        });
    }
};
</script>

<template>
    <user-profile-layout>
        <!--                <view-history v-if="isHost" :history-list="historyList ? historyList : []" />-->
        <!--                <Pagination-->
        <!--                    v-if="isHost"-->
        <!--                    :current-page="params.pageNumber"-->
        <!--                    :page-size="params.pageSize"-->
        <!--                    :total="params.total"-->
        <!--                    @numberChange="historyCurrentChange"-->
        <!--                    :hide-on-single-page="true"-->
        <!--                />-->
        <template #left>
            <el-affix :offset="10" target="#scrollContent_1">
                <div class="dark:bg-dark border-light dark:border-dark px-2 py-4 rounded-md">
                    <div class="flex flex-row items-center justify-center h-[20px] mb-4" v-if="!isCollapse">
                        <div class="flex flex-row items-center">
                            <span class="dark:text-dark"> MENU </span>
                        </div>
                    </div>
                    <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="isCollapse">
                        <el-menu-item index="1" @click="handleItemClick(1)">
                            <el-icon>
                                <Finished />
                            </el-icon>
                            <template #title>Publish</template>
                        </el-menu-item>
                        <el-menu-item index="2" @click="handleItemClick(2)">
                            <el-icon>
                                <ChatLineRound />
                            </el-icon>
                            <template #title>Comment</template>
                        </el-menu-item>
                        <el-menu-item index="3" @click="handleItemClick(3)">
                            <el-icon>
                                <Pointer />
                            </el-icon>
                            <template #title>Like</template>
                        </el-menu-item>
                        <el-menu-item index="4" @click="handleItemClick(4)">
                            <el-icon>
                                <StarFilled />
                            </el-icon>
                            <template #title>Collection</template>
                        </el-menu-item>
                        <el-menu-item index="5" @click="handleItemClick(5)">
                            <el-icon>
                                <Clock />
                            </el-icon>
                            <template #title>History</template>
                        </el-menu-item>
                    </el-menu>
                </div>
            </el-affix>
        </template>
        <template #right>
            <Loading :is-loading="isLoad" />
            <div id="scrollContent_1">
                <div v-if="currentDisplay === 1">
                    <all-type-preview-list :article-list="publishArticleList" v-if="!isLoad" />
                    <Pagination
                        :current-page="paramsStore.params.pageNumber"
                        :page-size="paramsStore.params.pageSize"
                        :total="total"
                        @numberChange="currentChange"
                        :hide-on-single-page="true"
                    />
                    {{ publishArticleList }}
                </div>
                <div v-if="currentDisplay === 5">
                    <!--                    <all-type-preview-list-->
                    <!--                        :article-list="convertToArticleList(historyList)"-->
                    <!--                        :view-time="toViewTimeList(historyList)"-->
                    <!--                        v-if="!isLoad"-->
                    <!--                    />-->
                    <!--                    <Pagination-->
                    <!--                        :current-page="paramsStore.params.pageNumber"-->
                    <!--                        :page-size="paramsStore.params.pageSize"-->
                    <!--                        :total="total"-->
                    <!--                        @numberChange="currentChange"-->
                    <!--                        :hide-on-single-page="true"-->
                    <!--                    />-->
                    {{ convertToArticleList(historyList) }}
                </div>
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
