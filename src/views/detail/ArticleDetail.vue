<script setup lang="ts">
import { getOneArticle, ArticleContentEntity } from '../../axios/api/articleApi';
// @ts-ignore
import { StarFilled, CaretTop, CaretBottom } from '@element-plus/icons-vue';
// @ts-ignore
import Markdown from 'vue3-markdown-it';
import { useRouteParams } from '@vueuse/router';
import { ElMessage } from 'element-plus';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { renderToc } from '../../utils';
import { subscribeAuthorByAuthorId } from '../../axios/api/subscribeApi';
import { likeArticle } from '../../axios/api/likesApi';
import { addCollection } from '../../axios/api/collectApi';
import UserInfoLite from '../../components/aside/UserInfoLite.vue';
import { getCommentsById } from '../../axios/api/commentsApi';
import { useDialogControlStore, useReloadCommentStore } from '../../pinia';
import { storeToRefs } from 'pinia';
const articleId = useRouteParams<string>('articleId');
const data = ref<ArticleContentEntity>({
    'article': {
        'articleId': '',
        // @ts-ignore
        'author': {
            'userId': '',
            'username': '',
            'signature': '',
            'avatar': 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            'level': 0,
            'registerTime': '',
            'lastLogin': '',
            'ipAddr': '',
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
        'comments': 0,
    },
    'comments': {
        'pageNumber': 1,
        'pageSize': 0,
        'currentSize': 0,
        'total': 0,
        'data': [],
    },
    'author': {
        'userId': '',
        'username': '',
        'signature': '',
        'avatar': 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        'level': 0,
        'registerTime': '',
        'lastLogin': '',
        'ipAddr': '',
    },
});
const isLoading = ref<boolean>(true);
onMounted(() => {
    getOneArticle(articleId.value).then((res) => {
        if (res.data.code == 200) {
            data.value = res.data.data;
            nextTick(() => {
                isLoading.value = false;
                renderToc();
                window.scroll({ top: 0, behavior: 'smooth' });
            });
        } else {
            ElMessage.error(res.data.message);
            useRouter().back();
        }
    });
});
onMounted(() => {
    const el = document.getElementsByName('markdown');
    const theme = localStorage.getItem('vueuse-color-scheme');
    el.forEach((el) => {
        if (!el) {
            return;
        }
        if (theme && theme == 'dark') {
            // @ts-ignore
            el.removeAttribute('class');
            // @ts-ignore
            el.classList.add('markdown-body-dark');
            ElMessage.warning('set dark');
        } else {
            // @ts-ignore
            el.removeAttribute('class');
            // @ts-ignore
            el.classList.add('markdown-body-light');
            ElMessage.warning('set light');
        }
    });
});
onBeforeRouteLeave(() => {
    // @ts-ignore
    tocbot.destroy();
});
onBeforeUnmount(() => {
    // @ts-ignore
    tocbot.destroy();
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
const handlerSubscribe = (userId: string) => {
    subscribeAuthorByAuthorId(userId).then((res) => {
        if (res.data.code == 200) {
            disableSubscribeBtn.value = true;
            ElMessage.success('SUCCESS');
        } else if (res.data.code == 722) {
            disableSubscribeBtn.value = true;
            ElMessage.warning('you already subscribed');
        }
    });
};

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
        class="article flex flex-row text-center justify-center md:m-auto md:my-2 ls:m-auto ls:my-2 lg:m-auto lg:my-2 sm:m-2 rounded-sm sm:max-w-full md:max-w-full lg:max-w-screen-lg xl:w-[1440px]"
    >
        <div class="flex flex-col ls:w-9/12 lg:w-9/12 md:w-9/12 sm:w-full text-left">
            <div class="flex flex-col p-6 dark:bg-dark rounded-md bg-light shadow-sm">
                <div class="flex flex-row items-center">
                    <span
                        class="rounded-full py-1 px-2 w-16 text-sm text-center dark:text-light"
                        style="background-color: #79bbff"
                        >Article</span
                    >
                    <span class="ml-2">
                        <el-tag class="mx-1" v-for="t in data.article.tags">
                            {{ t.tagName }}
                        </el-tag>
                    </span>
                </div>
                <div class="flex flex-col">
                    <span class="text-4xl dark:text-dark pt-4 pb-2">{{ data.article.title }}</span>
                    <span class="text-gray-500 dark:text-dark mt-2">{{ data.article.introduction }}</span>
                </div>
                <div class="flex flex-row justify-between px-2">
                    <div class="flex flex-row mt-4">
                        <div>
                            <el-avatar :size="60" :src="data.author.avatar" />
                        </div>
                        <div class="flex flex-col ml-4 justify-around">
                            <div class="flex flex-row items-center">
                                <div class="flex">
                                    <span class="text-lg text-gray-800 dark:text-dark">{{ data.author.username }}</span>
                                    <span class="text-sm text-gray-400 flex items-center mt-1 dark:text-dark"
                                        >&nbsp;@{{ data.author.userId }}</span
                                    >
                                </div>
                            </div>
                            <div>
                                <span class="text-sm text-gray-400">{{ data.article.releaseTime }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center mb-4">
                        <el-button
                            @click="handlerSubscribe(data.author.userId)"
                            type="primary"
                            :disabled="disableSubscribeBtn"
                            >Subscribe Author</el-button
                        >
                    </div>
                </div>
                <el-divider>CONTENT</el-divider>
                <Loading :is-loading="isLoading" />
                <div v-show="!isLoading">
                    <Markdown
                        name="markdown"
                        id="markdown"
                        class="markdown-body-light"
                        :source="data.article.content"
                    />
                </div>
                <el-divider>END</el-divider>
            </div>
            <div class="flex flex-col my-2 p-4 dark:bg-dark rounded-md bg-light shadow-sm">
                <Comment
                    :comments="data.comments.data"
                    :title="data.article.title"
                    :article-id="data.article.articleId"
                />
            </div>
        </div>
        <div class="flex ls:flex lg:flex md:hidden sm:hidden flex-col ml-2 w-3/12">
            <Loading :is-loading="isLoading" />
            <UserInfoLite v-show="!isLoading" :user="data.author" />
            <el-affix :offset="10">
                <div
                    class="js-toc text-left text-md transition-all dark:bg-dark dark:text-dark bg-light rounded-md shadow-sm px-4 py-2 overflow-auto break-all"
                    v-show="!isLoading"
                ></div>
            </el-affix>
        </div>
    </div>
</template>
<style scoped>
.article {
    min-height: 100vh;
}
</style>
<style>
.toc-link {
    text-decoration: none !important;
}

.toc-list {
    padding-left: 20px !important;
}

.toc-link::before {
    background-color: unset;
}

.toc-list-item {
    font-size: small;
}

.is-active-link::before {
    background-color: unset;
    color: dodgerblue;
}
</style>
