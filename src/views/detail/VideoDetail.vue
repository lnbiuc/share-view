<script setup lang="ts">
import { ArticleContentEntity, getOneArticle } from '../../axios/api/articleApi';
import { useRouteParams } from '@vueuse/router';
import { Ref, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import VideoDetailLayout from '../../layout/VideoDetailLayout.vue';
import { VideoPlayer } from '@videojs-player/vue';
import { useThemeStore } from '../../pinia';

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
const disableSubscribeBtn = ref<boolean | undefined>(false);
onMounted(() => {
    getOneArticle(videoId.value).then((res) => {
        if (res.data.code == 200) {
            data.value = res.data.data;
            disableSubscribeBtn.value = !!data.value?.article?.author.isSubscribed;
            nextTick(() => {
                window.scroll({ top: 0, behavior: 'smooth' });
            });
        } else {
            ElMessage.error(res.data.message);
            useRouter().back();
        }
    });
});

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
                                <el-tag class="mx-1" v-for="t in data.article.tags">
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
                    </div>
                </div>
            </template>
            <template #video>
                <video-player
                    class="w-full"
                    :src="data.article.content"
                    :poster="data.article.images[0]"
                    :controls="true"
                    :volume="0.5"
                    :prefer-full-window="true"
                />
            </template>
            <template #author>
                <div class="dark:text-dark mt-2">
                    {{ data.article.introduction }}
                </div>
                <!--                <div class="flex flex-row mt-3">-->
                <!--                    <div class="flex flex-col items-center justify-center">-->
                <!--                        <el-avatar :src="data.article.author.avatar" :size="80" class="shadow-md" />-->
                <!--                    </div>-->
                <!--                    <div class="flex flex-col ml-4">-->
                <!--                        <div class="flex flex-row items-center justify-between">-->
                <!--                            <div class="flex flex-row items-center">-->
                <!--                                <span class="title text-xl">{{ data.article.author.username }}</span>-->
                <!--                                <span class="text-sm ml-2 text-gray-400">@{{ data.article.author.userId }}</span>-->
                <!--                            </div>-->
                <!--                        </div>-->
                <!--                        <div>-->
                <!--                            <span class="text-xs dark:text-dark">{{ data.article.author.signature }}</span>-->
                <!--                        </div>-->
                <!--                    </div>-->
                <!--                    <div class="flex flex-row items-start">-->
                <!--                        &lt;!&ndash;                                <el-button plain bg color="#626aef" :dark="themeStore.isDark"> Subscribe </el-button>&ndash;&gt;-->
                <!--                        -->
                <!--                    </div>-->
                <!--                </div>-->
                <user-profile :user="data.article.author">
                    <subscribe-btn
                        :is-subscribed="data.article.author.isSubscribed"
                        :user-id="data.article.author.userId"
                        type="user"
                    />
                </user-profile>
            </template>
            <template #comment>
                <Comment :comments="data.comments" :title="data.article.title" :article-id="data.article.articleId" />
            </template>
        </VideoDetailLayout>
    </div>
</template>
