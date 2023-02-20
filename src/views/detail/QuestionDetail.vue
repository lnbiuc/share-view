<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { getOneArticle } from "../../api/article/articleApi";
// @ts-ignore
import Markdown from 'vue3-markdown-it';
import { formatTime } from "../../utils";
// @ts-ignore
import { View } from '@element-plus/icons-vue'
import { getAnswersByArticleId } from "../../api/Answer/answerApi";
import { getCommentsById } from "../../api/comments/commentsApi";
const articleId = useRouteParams<string>("questionId");
const ques = ref<Object>()
const answer = ref<Object>()
const isLoading = ref<boolean>(true)

onMounted(() => {
    getOneArticle(articleId.value).then(res => {
        if (res.data.code == 200) {
            ques.value = res.data.data;
            isLoading.value = false;
            getAnswer()
        }
    })
})
const total = ref<number>(0)

const getAnswer = () => {
    getAnswersByArticleId(articleId.value, 1, 10, 'like').then(res => {
        if (res.data.code == 200) {
            answer.value = res.data.data.data
            total.value = res.data.data.total
        }
    })
}

const showComments = ref(false)
const toLength = (arr:[]) => {
    if (arr) {
        return arr.length
    } else {
        return 0
    }
}
const comments = ref()
const getComments = (id:string) => {
    getCommentsById(id, 1, 10).then(res => {
        if (res.data.code == 200) {
            comments.value = res.data.data.data
            showComments.value = true
            nextTick(() => {

            })
        }
    })
}
</script>

<template>
    <div v-if="!isLoading" class="flex flex-row text-center justify-center md:m-auto md:my-2 ls:m-auto ls:my-2 lg:m-auto lg:my-2 sm:m-2 rounded-sm sm:max-w-full md:max-w-full ls:max-w-screen-ls lg:max-w-screen-lg">
        <Loading :is-loading="isLoading"/>
        <div class="flex flex-col w-8/12 mr-2 text-left bg-white p-4 rounded-md shadow-sm">
            <div class="flex flex-row items-center">
                <span class="rounded-full py-1 px-2 w-16 text-sm" style="background-color: #95d475">Question</span>
                <span class="ml-2">
                    <el-tag
                        class="mx-1"
                        v-for="t in ques.article.tags">
                        {{ t.tagName }}
                    </el-tag>
                </span>
            </div>
            <div class="my-4">
                <span class="my-2 text-xl leading-8">{{ ques.article.title }}</span>
            </div>
            <div class="text-sm mb-2 text-gray-500">
                <span class="text-sm font-semibold">
                    {{ ques.article.author.username }}
                </span>
                <span>
                    @{{ ques.article.author.userId }}
                </span>
                &nbsp;·&nbsp;
                <span v-html="formatTime(ques.article.releaseTime)" />
                &nbsp;·&nbsp;
                <span>
                    Publish On {{ ques.author.ipAddr }}
                </span>
            </div>
            <div class="mb-4">
                <el-divider>QUESTION</el-divider>
                <Markdown id="markdown" class="markdown-body-light" :source="ques.article.content" />
            </div>
            <div class="flex flex-row justify-between items-center">
                <div class="my-2">
                    <el-button>Subscribe This Question</el-button>
                    <el-button>Add To Collect</el-button>
                </div>
                <div>
                    <span class="flex flex-row items-center text-gray-500">
                        <el-icon class="mx-2"><View /></el-icon>
                        Views
                        {{ ques.article.views }}
                    </span>
                </div>
            </div>
            <div class="mb-2 mt-3">
                <div>
                    <span class="text-neutral-700 bg-gray-200 p-2 rounded-full text-sm">
                        Total:{{ total }} Answers
                    </span>
                </div>
                <el-divider>ANSWERS</el-divider>
                <div class="my-4" v-for="a in answer">
                    <div class="flex flex-row justify-between items-center">
                        <el-avatar :src="a.author.avatar" size="large" class="flex-start w-2/12"/>
                        <div class="flex flex-col w-8/12 mr-4">
                            <div>
                                <span class="text-lg cursor-pointer">{{ a.author.username }}</span>
                                <span class="text-xs text-gray-500">@{{ a.author.userId }}</span>
                            </div>
                            <span class="text-xs whitespace-nowrap overflow-clip">{{ a.author.signature }}</span>
                        </div>
                        <div class="flex-end w-2/12 mt-4">
                            <el-button>Subscribe</el-button>
                        </div>
                    </div>
                    <div class="mt-8">
                        <Markdown id="markdown" class="markdown-body-light" :source="a.content" />
                    </div>
                    <div class="text-xs mt-3 mx-2 flex flex-row justify-between">
                        <span>Publish On: {{ a.releaseTime }} </span>
                        <span>
                            Last Modify:
                            <span v-text="formatTime(a.lastUpdate)"/>
                        </span>
                    </div>
                    <div class="mt-3 flex flex-row">
                        <LikeBtn/>
                        <CommentsLink :comments="toLength(a.comments)" @click="getComments(a.id)"/>
                        <ShareLink/>
                        <CollectionLink/>
                    </div>
                </div>
                <div v-if="showComments">
                    <Comment :comments="comments"/>
                </div>
                <el-divider/>
            </div>
        </div>
        <div class="flex flex-col w-4/12">

        </div>
    </div>
</template>
