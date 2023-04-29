<script setup lang="ts">
import { getOneArticle, ArticleContentEntity } from '../../axios/api/articleApi';
import { useRouteParams } from '@vueuse/router';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { refreshSubscribe } from '../../axios/api/subscribeApi';
import { likeArticle } from '../../axios/api/likesApi';
import { addCollection } from '../../axios/api/collectApi';
import UserInfoLite from '../../components/aside/UserInfoLite.vue';
import { getCommentsById } from '../../axios/api/commentsApi';
import { useReloadCommentStore, useThemeStore } from '../../pinia';
import { storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import DefaultDetailLayout from '../../layout/DefaultDetailLayout.vue';

const articleId = useRouteParams<string>('articleId');
const data: Ref<ArticleContentEntity> = ref({
    article: {
        articleId: '',
        author: {
            userId: '',
            username: '',
            signature: '',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            level: 1,
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
    comments: {
        pageNumber: 0,
        pageSize: 0,
        currentSize: 0,
        total: 6,
        data: [],
    },
});
const isLoading = ref<boolean>(true);
onMounted(() => {
    getOneArticle(articleId.value).then((res) => {
        if (res.data.code == 200) {
            data.value = res.data.data;
            isLoading.value = false;
            disableSubscribeBtn.value = data.value.article.author.isSubscribed;
            params.value.total = data.value.comments.total;
            nextTick(() => {
                window.scroll({ top: 0, behavior: 'smooth' });
            });
        } else {
            ElMessage.error(res.data.message);
            useRouter().back();
        }
    });
});

const like = (isLike: number) => {
    likeArticle(articleId.value, 0, isLike).then((res) => {
        if (res.data.code == 200) {
            ElMessage.success('SUCCESS');
        } else {
            ElMessage.warning(res.data.message);
        }
    });
};

const collect = () => {
    addCollection(articleId.value, 0).then((res) => {
        if (res.data.code == 200) {
            ElMessage.success('SUCCESS');
        } else {
            ElMessage.warning(res.data.message);
        }
    });
};
const disableSubscribeBtn = ref<boolean>(false);

const store = useReloadCommentStore();
const refStore = storeToRefs(store);
watch(refStore.count, () => {
    if (refStore.reload.value == data.value.article.articleId) {
        reloadComment(data.value.article.articleId);
    }
});

const reloadComment = (id: string) => {
    getCommentsById(articleId.value, params.value.pageNumber, params.value.pageSize).then((res) => {
        params.value.total = res.data.data.total;
        data.value.comments = res.data.data;
    });
};

const themeStore = useThemeStore();
const refThemeStore = storeToRefs(themeStore);
const currentTheme = ref<'dark' | 'light'>(themeStore.isDark ? 'dark' : 'light');
watch(refThemeStore.isDark, (val) => {
    currentTheme.value = val ? 'dark' : 'light';
});

const MdCatalog = MdEditor.MdCatalog;

const state = reactive({
    id: 'my-editor',
});

const scrollElement = document.documentElement;

const params = ref<{ pageNumber: number; pageSize: number; total: number }>({ pageNumber: 1, pageSize: 10, total: 0 });

const commentPageNumberChange = (pageNumber: number) => {
    params.value.pageNumber = pageNumber;
    getCommentsById(articleId.value, pageNumber, params.value.pageSize).then((res) => {
        params.value.total = res.data.data.total;
        data.value.comments = res.data.data;
    });
};
</script>

<template>
    <DefaultDetailLayout>
        <template #left>
            <div class="flex flex-col p-6 dark:bg-dark rounded-md bg-light shadow-sm">
                <div class="flex flex-row flex-wrap justify-start items-center">
                    <span
                        class="rounded-full py-1 px-2 w-16 text-sm text-center dark:text-light"
                        style="background-color: #79bbff"
                        >Article</span
                    >
                    <span class="ml-2 flex flex-row flex-wrap justify-start items-center">
                        <el-tag class="mx-1" v-for="t in data.article.tags">
                            {{ t.tagName ? t.tagName : '' }}
                        </el-tag>
                    </span>
                </div>
                <div class="flex flex-col mb-2">
                    <span class="text-4xl dark:text-dark pt-4 pb-2">{{ data.article.title }}</span>
                    <span class="text-gray-500 dark:text-dark mt-2 text-indent" style="text-indent: 40px">{{
                        data.article.introduction
                    }}</span>
                </div>
                <el-divider>AUTHOR</el-divider>
                <user-profile :user="data.article.author" class="mb-2">
                    <subscribe-btn
                        :is-subscribed="data.article.author.isSubscribed"
                        :user-id="data.article.author.userId"
                        type="user"
                    />
                </user-profile>
                <el-divider>CONTENT</el-divider>
                <Loading :is-loading="isLoading" />
                <div v-show="!isLoading">
                    <md-editor
                        :editor-id="state.id"
                        preview-theme="cyanosis"
                        :show-code-row-number="true"
                        v-model="data.article.content"
                        :theme="currentTheme"
                        :preview-only="true"
                    />
                </div>
                <el-divider>END</el-divider>
            </div>
            <div class="flex flex-col my-2 p-4 dark:bg-dark rounded-md bg-light shadow-sm">
                <Comment
                    :total="params.total"
                    :comments="data.comments"
                    :title="data.article.title"
                    :article-id="data.article.articleId"
                />
                <Pagination
                    :current-page="params.pageNumber"
                    :page-size="params.pageSize"
                    :total="params.total"
                    @numberChange="commentPageNumberChange"
                    :hide-on-single-page="true"
                />
            </div>
        </template>
        <template #right>
            <Loading :is-loading="isLoading" />
            <UserInfoLite v-show="!isLoading" :user="data.article.author" />
            <el-affix :offset="10">
                <div
                    class="text-left text-md transition-all dark:bg-dark dark:text-dark bg-light rounded-md shadow-sm px-4 py-2 overflow-auto break-all"
                    v-show="!isLoading"
                >
                    <div class="flex flex-row justify-center items-center mb-1">
                        <el-icon color="#409eff" :size="25">
                            <i-ant-design-unordered-list-outlined />
                        </el-icon>
                        <span class="ml-2">TOC</span>
                    </div>
                    <md-catalog :editor-id="state.id" :scroll-element="scrollElement" :theme="currentTheme" />
                </div>
            </el-affix>
        </template>
    </DefaultDetailLayout>
</template>
