<script setup lang="ts">
import { ArticleContentEntity, getOneArticle } from '../../axios/api/articleApi';
import { useRouteParams } from '@vueuse/router';
import { Ref, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import VideoDetailLayout from '../../layout/VideoDetailLayout.vue';
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
</script>

<template>
    <div>
        <VideoDetailLayout>
            <template #header>
                <span>{{ data.article.title }}</span>
            </template>
            <template #video>
                <video-player
                    :src="data.article.content"
                    :poster="data.article.images[0]"
                    :controls="true"
                    :loop="true"
                    :volume="0.5"
                    :prefer-full-window="true"
                />
            </template>
            <template #author> </template>
            <template #comment>
                <Comment
                    :comments="data.comments"
                    :title="data.article.title"
                    :article-id="data.article.articleId"
                />
            </template>
        </VideoDetailLayout>
    </div>
</template>
