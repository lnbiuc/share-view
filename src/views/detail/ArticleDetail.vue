<script setup lang="ts">
import { getOneArticle, ArticleContentEntity } from '../../api/article/articleApi';
// @ts-ignore
import { StarFilled, CaretTop, CaretBottom } from '@element-plus/icons-vue';
// @ts-ignore
import Markdown from 'vue3-markdown-it';
import { useRouteParams } from '@vueuse/router';
import { ElMessage } from 'element-plus';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { useThemeStore } from '../../pinia';
import { storeToRefs } from 'pinia';
import { renderToc } from '../../utils';
import { formatTime } from '../../utils';
const articleId = useRouteParams<string>('articleId');
const data = ref<ArticleContentEntity>({
    'article': {
        'articleId': 'loading~~',
        // @ts-ignore
        'author': {
            'userId': 'loading~~',
            'username': 'loading~~',
            'signature': 'loading~~',
            'avatar': 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            'level': 0,
            'registerTime': 'loading~~',
            'lastLogin': 'loading~~',
            'ipAddr': 'loading~~',
        },
        'title': 'loading~~',
        'introduction': 'loading~~',
        'type': 'Article',
        'tags': [],
        'category': 'loading~~',
        'content': 'loading~~',
        'releaseTime': 'loading~~',
        'lastUpdate': 'loading~~',
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
        'userId': 'loading~~',
        'username': 'loading~~',
        'signature': 'loading~~',
        'avatar': 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        'level': 0,
        'registerTime': 'loading~~',
        'lastLogin': 'loading~~',
        'ipAddr': 'loading~~',
    },
});

onMounted(() => {
    getOneArticle(articleId.value).then((res) => {
        if (res.data.code == 200) {
            data.value = res.data.data;
            nextTick(() => {
                renderToc();
                window.scroll({ top: 0, behavior: 'smooth' });
            });
        } else {
            ElMessage.error(res.data.message);
            useRouter().back();
        }
    });
    const el = document.getElementById('markdown');
    const theme = localStorage.getItem('vueuse-color-scheme')
    if (theme && theme == 'dark') {
        // @ts-ignore
        el.removeAttribute('class');
        // @ts-ignore
        el.classList.add('markdown-body-dark');
    } else {
        // @ts-ignore
        el.removeAttribute('class');
        // @ts-ignore
        el.classList.add('markdown-body-light');
    }
});
onBeforeRouteLeave(() => {
    // @ts-ignore
    tocbot.destroy();
});
onBeforeUnmount(() => {
    // @ts-ignore
    tocbot.destroy();
});
const themeStore = storeToRefs(useThemeStore());
watch(themeStore.isDark, () => {
    const el = document.getElementById('markdown');
    if (themeStore.isDark.value) {
        // @ts-ignore
        el.removeAttribute('class');
        // @ts-ignore
        el.classList.add('markdown-body-dark');
    } else {
        // @ts-ignore
        el.removeAttribute('class');
        // @ts-ignore
        el.classList.add('markdown-body-light');
    }
});
const subStrTime = (time:string) => {
    return time.substring(0,10)
}
</script>

<template>
    <div
        class="article flex flex-row text-center justify-center md:m-auto md:my-2 ls:m-auto ls:my-2 lg:m-auto lg:my-2 sm:m-2 rounded-sm  sm:max-w-full md:max-w-full ls:max-w-screen-ls lg:max-w-screen-lg"
    >
        <div class="ls:flex lg:flex md:flex sm:hidden justify-center w-1/12 relative items-center">
            <div class="fixed top-1/4">
                <div class="flex flex-col">
                    <el-icon
                        class="p-0.5 my-2 cursor-pointer bg-gray-200 rounded-full hover:bg-gray-300 transition-all dark:bg-dark dark:hover:bg-gray-800"
                        size="40px"
                        color="gray"
                        ><CaretTop
                    /></el-icon>
                    <el-icon
                        class="p-0.5 my-2 cursor-pointer bg-gray-200 rounded-full hover:bg-gray-300 transition-all dark:bg-dark dark:hover:bg-gray-800"
                        size="40px"
                        color="gray"
                        ><CaretBottom
                    /></el-icon>
                    <el-icon
                        class="p-0.5 my-2 cursor-pointer bg-gray-200 rounded-full hover:bg-gray-300 transition-all dark:bg-dark dark:hover:bg-gray-800"
                        size="40px"
                        color="gray"
                        ><StarFilled /></el-icon
                    >&nbsp;
                </div>
            </div>
        </div>
        <div class="flex flex-col dark:bg-dark ls:w-8/12 lg:w-9/12 md:w-10/12 sm:w-full text-left rounded-md bg-white shadow-sm">
            <div class="flex flex-col p-4">
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
                                        >&nbsp;@{{ data.author.userId }}</span>
                                </div>
                            </div>
                            <div>
                                <span class="text-sm text-gray-400">{{ data.article.releaseTime }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center mb-4">
                        <el-button>Subscribe</el-button>
                    </div>
                </div>
                <el-divider>CONTENT</el-divider>
                <div>
                    <Markdown id="markdown" class="markdown-body-light" :source="data.article.content" />
                </div>
                <el-divider>END</el-divider>
            </div>
        </div>
        <div class="flex ls:flex lg:flex md:hidden sm:hidden flex-col ml-2 w-3/12">
            <div class="bg-white rounded-md shadow-sm mb-2 p-4 dark:bg-dark">
                <el-avatar :size="130" :src="data.author.avatar"/>
                <div class="flex flex-col text-left">
                    <span class="text-xl font-bold mt-1 dark:text-dark">{{ data.author.username }}</span>
                    <span class="text-sm text-gray-400">@{{ data.author.userId }}</span>
                    <span class="text-md text-gray-400 my-1">Signature:{{ data.author.signature }}</span>
                    <span class="text-sm text-gray-400">Register:
                        <span v-text="formatTime(data.author.registerTime)"></span>
                    </span>
                    <span class="text-sm text-gray-400">Last Online:
                        <span v-text="subStrTime(data.author.lastLogin)"></span>
                    </span>
                    <span class="text-sm text-gray-400">IP:{{ data.author.ipAddr }}</span>
                </div>
            </div>
            <el-affix :offset="10">
                <div
                    class="js-toc text-left text-md transition-all dark:bg-dark dark:text-dark bg-white rounded-md shadow-sm px-4 py-2 overflow-auto break-all"
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

.is-active-link::before {
    background-color: unset;
}
</style>
