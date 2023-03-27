<script setup lang="ts">
import {ArticleContentEntity, getOneArticle} from "../../axios/api/articleApi";
import {useRouteParams} from "@vueuse/router";
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import VideoDetailLayout from "../../layout/VideoDetailLayout.vue";
const videoId = useRouteParams<string>('videoId');
const data = ref<ArticleContentEntity>();
const disableSubscribeBtn = ref<boolean | undefined>(false)
onMounted(() => {
    getOneArticle(videoId.value).then(res => {
        if (res.data.code == 200) {
            data.value = res.data.data;
            disableSubscribeBtn.value = data.value?.article.author.isSubscribed;
            nextTick(() => {
                window.scroll({ top: 0, behavior: 'smooth' });
            });
        } else {
            ElMessage.error(res.data.message);
            useRouter().back();
        }
    })
})

</script>

<template>
    <div>
        <VideoDetailLayout>
            <template #header>
                <span>{{ data?.article.title }}</span>
            </template>
            <template #video>
                <video-player
                    :src="data?.article.content"
                    :poster="data?.article.images[0]"
                    :controls="true"
                    :loop="true"
                    :volume="0.5"
                    :prefer-full-window="true"
                />
            </template>
            <template #author>

            </template>
            <template #comment>
                <Comment
                    :comments="data?.comments.data"
                    :title="data?.article.title"
                    :article-id="data?.article.articleId"
                />
            </template>
        </VideoDetailLayout>
    </div>
</template>
