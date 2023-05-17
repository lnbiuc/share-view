<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { ArticleContentEntity, getOneArticle } from '../../axios/api/articleApi';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { formatTime } from '../../utils';
import { useReloadCommentStore } from '../../pinia';
import { storeToRefs } from 'pinia';
import { getCommentsById } from '../../axios/api/commentsApi';
import DefaultDetailLayout from '../../layout/DefaultDetailLayout.vue';
import { Ref } from 'vue';

const articleId = useRouteParams<string>('postId');
const isLoad = ref<boolean>(true);
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
        category: 0,
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
onMounted(() => {
    getOneArticle(articleId.value).then((res) => {
        if (res.data.code == 200) {
            data.value = res.data.data;
            nextTick(() => {
                isLoad.value = false;
                window.scroll({ top: 0, behavior: 'smooth' });
            });
        } else {
            ElMessage.error(res.data.message);
            useRouter().back();
        }
    });
});

const store = useReloadCommentStore();
const refStore = storeToRefs(store);
watch(refStore.count, () => {
    if (refStore.reload.value == data.value?.article?.articleId) {
        reloadComment(data.value.article.articleId);
    }
});

const reloadComment = (id: string) => {
    getCommentsById(id, 1, 100).then((res) => {
        data.value.comments = res.data.data;
    });
};

const refresh = () => {
    getOneArticle(articleId.value).then((res) => {
        if (res.data.code == 200) {
            data.value = res.data.data;
        } else {
            ElMessage.error(res.data.message);
        }
    });
};
</script>

<template>
    <loading :is-loading="isLoad" />
    <DefaultDetailLayout>
        <template #left>
            <div class="flex flex-col p-6 dark:bg-dark rounded-md bg-light shadow-sm">
                <div class="mb-4">
                    <span
                        class="rounded-full py-1 px-2 w-14 text-sm text-center dark:text-light"
                        style="background-color: #eebe77"
                    >
                        Post
                    </span>
                </div>
                <el-divider>AUTHOR</el-divider>
                <user-profile :user="data.article.author">
                    <subscribe-btn
                        :is-subscribed="data.article.author.isSubscribed"
                        :user-id="data.article.author.userId"
                        type="user"
                    />
                </user-profile>
                <el-divider>CONTENT</el-divider>
                <div class="my-4 text-light dark:text-dark">
                    {{ data.article.introduction }}
                </div>
                <div class="mb-4 w-full" v-viewer>
                    <img
                        class="w-full shadow-md rounded-md my-1"
                        v-for="(i, index) in data.article.images"
                        :key="index"
                        :src="i"
                        alt=""
                    />
                </div>
                <div class="flex flex-row">
                    <LikeBtn
                        :type="0"
                        :id="data.article.articleId"
                        @on-like-success="refresh"
                        :like="data.article.like"
                    />
                    <CommentsLink :comments="data.comments.total" />
                    <ShareLink />
                    <CollectionLink
                        :type="0"
                        :id="data.article.articleId"
                        :collect-count="data.article.collect"
                        @on-collect-success="refresh"
                    />
                </div>
                <div>
                    <Comment
                        :total="data.comments.total"
                        :comments="data.comments"
                        :title="data.article.introduction"
                        :article-id="data.article.articleId"
                    />
                </div>
            </div>
        </template>
        <template #right>
            <el-affix :offset="10">
                <UserInfoLite :user="data.article.author" />
            </el-affix>
        </template>
    </DefaultDetailLayout>
</template>
