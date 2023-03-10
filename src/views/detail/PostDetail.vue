<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { ArticleContentEntity, getOneArticle } from '../../axios/api/articleApi';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { formatTime } from '../../utils';
// @ts-ignore
import { useReloadCommentStore } from '../../pinia';
import { storeToRefs } from 'pinia';
import { getCommentsById } from '../../axios/api/commentsApi';

const articleId = useRouteParams<string>('postId');
const isLoad = ref<boolean>(true);
const data = ref<ArticleContentEntity>({
    'article': {
        'articleId': '',
        'author': {
            'userId': '',
            'username': '',
            'signature': '',
            'avatar': 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            'level': 0,
            'registerTime': '',
            'lastLogin': '',
            'ipAddr': '',
            'isSubscribed': false,
        },
        'title': '',
        'introduction': '',
        'type': 'Article',
        'tags': [],
        'category': '',
        'content': '',
        'releaseTime': '',
        'lastUpdate': '',
        'setTop': false,
        'views': 0,
        'like': 0,
        'collect': 0,
        'comments': 0,
    },
    'comments': {
        'pageNumber': 1,
        'pageSize': 0,
        'currentSize': 0,
        'total': 0,
        'data': [],
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
    if (refStore.reload.value == data.value.article.articleId) {
        reloadComment(data.value.article.articleId);
    }
});

const reloadComment = (id: string) => {
    getCommentsById(id, 1, 100).then((res) => {
        data.value.comments = res.data.data;
    });
};
</script>

<template>
    <div
        class="flex flex-row text-center justify-center md:m-auto md:my-2 ls:m-auto ls:my-2 lg:m-auto lg:my-2 sm:m-2 rounded-sm sm:max-w-full md:max-w-full ls:max-w-screen-ls lg:max-w-screen-lg"
    >
        <div
            class="flex flex-col ls:w-9/12 lg:w-9/12 md:w-9/12 sm:w-full text-left bg-light dark:bg-dark rounded-md shadow-sm p-4"
        >
            <div class="flex flex-row flex-wrap justify-between items-center">
                <div class="flex flex-row justify-center items-center">
                    <el-avatar size="large" class="mr-4" :src="data.article.author.avatar" />
                    <span class="text-2xl">{{ data.article.author.username }}</span>
                    <span class="text-xs mx-1 text-gray-500">@{{ data.article.author.userId }}</span>
                    <span class="text-sm text-gray-500" v-text="formatTime(data.article.releaseTime)"></span>
                </div>
                <div class="flex flex-row items-center">
                    <el-button>Subscribe</el-button>
                </div>
            </div>
            <div class="my-4">
                {{ data.article.introduction }}
            </div>
            <div v-viewer class="mb-4">
                <img v-for="i in data.article.images" :src="i" alt="" />
            </div>
            <div class="flex flex-row">
                <LikeBtn :type="0" :id="data.article.articleId" />
                <CommentsLink />
                <ShareLink />
                <CollectionLink :type="0" :id="data.article.articleId" />
            </div>
            <div>
                <Comment
                    :comments="data.comments.data"
                    :title="data.article.introduction"
                    :article-id="data.article.articleId"
                />
            </div>
        </div>
        <div class="flex ls:flex lg:flex md:hidden sm:hidden flex-col ml-2 w-3/12">
            <el-affix :offset="10">
                <UserInfoLite :user="data.article.author" />
            </el-affix>
        </div>
    </div>
</template>
