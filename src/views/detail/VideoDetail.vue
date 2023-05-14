<script setup lang="ts">
import { ArticleContentEntity, getOneArticle } from '../../axios/api/articleApi';
import { useRouteParams } from '@vueuse/router';
import { Ref, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import VideoDetailLayout from '../../layout/VideoDetailLayout.vue';
import { VideoPlayer } from '@videojs-player/vue';
import { useReloadCommentStore, useThemeStore } from '../../pinia';
import { storeToRefs } from 'pinia';
import { getCommentsById } from '../../axios/api/commentsApi';
import { addCollection } from '../../axios/api/collectApi';

const videoId = useRouteParams<string>('videoId');

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
        total: 0,
        data: [],
    },
});
onMounted(() => {
    getOneArticle(videoId.value).then((res) => {
        if (res.data.code == 200) {
            data.value = res.data.data;
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

const handleOnLikeSuccess = () => {
    getOneArticle(data.value.article.articleId).then((res) => {
        if (res.data.code == 200) {
            data.value.article.like = res.data.data.article.like;
        }
    });
};

const params = ref<{ pageNumber: number; pageSize: number; total: number }>({ pageNumber: 1, pageSize: 10, total: 0 });

const store = useReloadCommentStore();
const refStore = storeToRefs(store);
watch(refStore.count, () => {
    if (refStore.reload.value == data.value.article.articleId) {
        refreshComment();
    }
});

const refreshComment = () => {
    getCommentsById(data.value.article.articleId, params.value.pageNumber, params.value.pageSize).then((res) => {
        if (res.data.code == 200) {
            data.value.comments = res.data.data;
            params.value.total = data.value.comments.total;
        }
    });
};

const commentPageNumberChange = (pageNumber: number) => {
    params.value.pageNumber = pageNumber;
    refreshComment();
};

const handleAddCollection = (articleId: string) => {
    addCollection(articleId, 4).then((res) => {
        if (res.data.code == 200) {
            ElMessage.success('SUCCESS');
        } else {
            ElMessage.warning(res.data.message);
        }
    });
};

const themeStore = useThemeStore();
</script>

<template>
    <div>
        <VideoDetailLayout>
            <template #header>
                <div class="flex flex-col">
                    <div class="flex flex-row flex-wrap">
                        <div class="pt-2 pb-4 flex flex-row items-center">
                            <span
                                class="rounded-full py-1 px-2 w-12 text-sm text-center dark:text-light"
                                style="background-color: #fab6b6"
                            >
                                Video
                            </span>
                            <span class="ml-2">
                                <el-tag class="mx-1" size="large" v-for="t in data.article.tags" :key="t.tagId">
                                    {{ t.tagName ? t.tagName : '' }}
                                </el-tag>
                            </span>
                        </div>
                    </div>
                    <div class="text-2xl dark:text-dark mb-2">{{ data.article.title }}</div>
                    <div class="flex flex-row items-center my-1 text-sm text-gray-500 dark:text-gray-400">
                        <el-icon>
                            <i-mdi-eye />
                        </el-icon>
                        <span class="mx-2">
                            {{ data.article.views }}
                            Views
                        </span>
                        <span class="mr-2"></span>
                        <el-icon>
                            <i-mdi-thumb-up />
                        </el-icon>
                        <span class="mx-2">
                            {{ data.article.like }}
                            Likes
                        </span>
                        <el-icon color="ml-2">
                            <i-ant-design-clock-circle-filled />
                        </el-icon>
                        <span class="mx-2">
                            {{ data.article.releaseTime }}
                        </span>
                    </div>
                </div>
            </template>
            <template #video>
                <video-player
                    class="w-full min-h-[500px]"
                    :src="data.article.content"
                    :poster="data.article.images[0]"
                    :controls="true"
                    :volume="0.5"
                    :prefer-full-window="true"
                    :playback-rates="[0.7, 1.0, 1.5, 2.0]"
                    playsinline
                />
            </template>
            <template #author>
                <span class="dark:text-dark mt-2">
                    {{ data.article.introduction }}
                </span>
                <div class="flex flex-row mt-4">
                    <LikeBtn
                        :like="data.article.like"
                        :id="data.article.articleId"
                        :type="0"
                        @on-like-success="handleOnLikeSuccess"
                    />
                    <el-button type="primary" @click="handleAddCollection(data.article.articleId)">
                        Add Collection
                    </el-button>
                </div>
                <el-divider>AUTHOR</el-divider>
                <user-profile :user="data.article.author">
                    <subscribe-btn
                        :is-subscribed="data.article.author.isSubscribed"
                        :user-id="data.article.author.userId"
                        type="user"
                    />
                </user-profile>
                <el-divider>COMMENT</el-divider>
            </template>
            <template #comment>
                <Comment
                    :comments="data.comments"
                    :total="data.comments.total"
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
            </template>
        </VideoDetailLayout>
    </div>
</template>
<style>
.video-js .vjs-big-play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
