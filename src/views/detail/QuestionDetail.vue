<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { getOneArticle } from '../../axios/api/articleApi';
// @ts-ignore
import Markdown from 'vue3-markdown-it';
import { formatTime } from '../../utils';
// @ts-ignore
import { View } from '@element-plus/icons-vue';
import { getAnswersByArticleId } from '../../axios/api/answerApi';
import { getCommentsById } from '../../axios/api/commentsApi';
import { ElMessage } from 'element-plus';
// @ts-ignore
import { ArrowDown } from '@element-plus/icons-vue';
import { useDialogControlStore, useReloadCommentStore } from '../../pinia';
import { subscribeAuthorByAuthorId, subscribeQuestionById } from '../../axios/api/subscribeApi';
import { addCollection } from '../../axios/api/collectApi';
import { storeToRefs } from 'pinia';
const articleId = useRouteParams<string>('questionId');
const ques = ref();
const answer = ref();
const isLoading = ref<boolean>(true);

onMounted(() => {
    getOneArticle(articleId.value).then((res) => {
        if (res.data.code == 200) {
            ques.value = res.data.data;
            isLoading.value = false;
            getAnswer();
        }
    });
});
const total = ref<number>(0);
const getAnswer = () => {
    getAnswersByArticleId(articleId.value, 1, 10, 'like').then((res) => {
        if (res.data.code == 200) {
            answer.value = res.data.data.data;
            total.value = res.data.data.total;
        }
    });
};

const toLength = (arr: []) => {
    if (arr) {
        return arr.length;
    } else {
        return 0;
    }
};
const comments = ref();
const currentComments = ref();
const getComments = (id: string) => {
    getCommentsById(id, 1, 10).then((res) => {
        if (res.data.code == 200) {
            comments.value = res.data.data.data;
            currentComments.value = id;
            return true;
        } else {
            ElMessage.warning(res.data.message);
            return false;
        }
    });
};

const reloadCommentStore = useReloadCommentStore();
const refReloadCommentStore = storeToRefs(reloadCommentStore);
watch(refReloadCommentStore.count, () => {
    getComments(currentComments.value);
});

const showComments = (id: string) => {
    return id == currentComments.value;
};
const currentSortSelect = ref('LIKE');
const sortChange = (type: string) => {
    if (type == 'LIKE') {
        currentSortSelect.value = 'LIKE';
    } else {
        currentSortSelect.value = 'NEW';
    }
};

const dialogControlStore = useDialogControlStore();
const subscribeQuestionBtn = ref(false);
const subscribeQuestion = (id: string) => {
    subscribeQuestionById(id).then((res) => {
        if (res.data.code == 200) {
            ElMessage.success('SUCCESS');
            subscribeQuestionBtn.value = true;
        } else if (res.data.code == 722) {
            subscribeQuestionBtn.value = true;
            ElMessage.warning(res.data.message);
        } else {
            ElMessage.warning(res.data.message);
        }
    });
};

const addCollectionBtn = ref(false);
const addQuestionCollection = (id: string) => {
    addCollection(id, 0).then((res) => {
        if (res.data.code == 200) {
            ElMessage.success('SUCCESS');
            addCollectionBtn.value = true;
        } else if (res.data.code == 719) {
            addCollectionBtn.value = true;
            ElMessage.warning(res.data.message);
        } else {
            ElMessage.warning(res.data.message);
        }
    });
};

const subscribeAnswerById = (id: string) => {
    subscribeAuthorByAuthorId(id).then((res) => {
        if (res.data.code == 200) {
            ElMessage.success('SUCCESS');
        } else if (res.data.code == 722) {
            ElMessage.warning(res.data.message);
        } else {
            ElMessage.warning(res.data.message);
        }
    });
};
</script>

<template>
    <div
        v-if="!isLoading"
        class="flex flex-row text-center justify-center md:m-auto md:my-2 ls:m-auto ls:my-2 lg:m-auto lg:my-2 sm:m-2 rounded-sm sm:max-w-full md:max-w-full ls:max-w-screen-ls lg:max-w-screen-lg"
    >
        <Loading :is-loading="isLoading" />
        <div class="flex flex-col w-9/12 mr-2 text-left bg-light p-4 dark:bg-dark rounded-md shadow-sm">
            <div class="flex flex-row items-center">
                <span
                    class="rounded-full py-1 px-2 w-20 text-sm dark:text-neutral-800"
                    style="background-color: #95d475"
                    >Question</span
                >
                <span class="ml-2">
                    <el-tag class="mx-1" v-for="t in ques.article.tags">
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
                <span> @{{ ques.article.author.userId }} </span>
                &nbsp;·&nbsp;
                <span v-html="formatTime(ques.article.releaseTime)" />
                &nbsp;·&nbsp;
                <span> Publish On {{ ques.author.ipAddr }} </span>
            </div>
            <div class="my-2">
                <el-button @click="subscribeQuestion(ques.article.articleId)" :disabled="subscribeQuestionBtn"
                    >Subscribe This Question</el-button
                >
                <el-button @click="addQuestionCollection(ques.article.articleId)" :disabled="addCollectionBtn"
                    >Add To Collect</el-button
                >
            </div>
            <div class="mb-4">
                <Markdown name="markdown" class="markdown-body-light" :source="ques.article.content" />
            </div>
            <div class="mb-2 mt-3">
                <div class="flex flex-row justify-between items-center p-2 rounded-md bg-gray-100 dark:bg-neutral-800">
                    <div class="flex flex justify-start items-center">
                        <span
                            class="text-neutral-700 bg-gray-200 px-3 py-1 rounded-full text-sm dark:bg-dark dark:text-gray-300"
                        >
                            Total :
                            <span class="text-blue-500">{{ total }}</span>
                            Answers
                        </span>
                        <el-button
                            class="ml-4"
                            type="primary"
                            @click="dialogControlStore.answerQuestionForm.status = true"
                            >Create Answer</el-button
                        >
                    </div>
                    <span>
                        <el-dropdown trigger="click">
                            <span class="el-dropdown-link align-top cursor-pointer">
                                <el-button>
                                    {{ currentSortSelect }}
                                    <el-icon><ArrowDown /></el-icon>
                                </el-button>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item
                                        @click="sortChange('LIKE')"
                                        :disabled="currentSortSelect === 'LIKE'"
                                        >LIKE
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="sortChange('NEW')" :disabled="currentSortSelect === 'NEW'"
                                        >NEW
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </span>
                </div>
                <div class="my-4" v-for="a in answer">
                    <el-divider />
                    <div class="flex flex-row justify-between items-center">
                        <el-avatar :src="a.author.avatar" size="large" class="flex-start w-2/12" />
                        <div class="flex flex-col w-8/12 mr-4">
                            <div>
                                <span class="text-lg cursor-pointer">{{ a.author.username }}</span>
                                <span class="text-xs text-gray-500">@{{ a.author.userId }}</span>
                            </div>
                            <span class="text-xs whitespace-nowrap overflow-clip">{{ a.author.signature }}</span>
                        </div>
                        <div class="flex-end w-2/12 mt-4">
                            <el-button @click="subscribeAnswerById(a.author.userId)">Subscribe</el-button>
                        </div>
                    </div>
                    <div class="mt-8">
                        <Markdown name="markdown" class="markdown-body-light" :source="a.content" />
                    </div>
                    <div class="text-xs mt-3 mx-2 flex flex-row justify-between">
                        <span class="text-gray-500">Publish On: {{ a.releaseTime }} </span>
                        <span>
                            Last Modify:
                            <span v-text="formatTime(a.lastUpdate)" />
                        </span>
                    </div>
                    <div class="mt-3 flex flex-row">
                        <LikeBtn :id="a.id" :type="2" />
                        <CommentsLink :comments="toLength(a.comments)" @click="getComments(a.id)" />
                        <ShareLink />
                        <CollectionLink :type="1" :id="a.id" />
                    </div>
                    <div v-if="showComments(a.id)">
                        <Comment :comments="comments" :article-id="a.id" :title="a.author.username + '\'s Answer'" />
                    </div>
                </div>
                <el-divider />
            </div>
        </div>
        <div class="flex flex-col w-3/12">
            <el-affix :offset="10">
                <UserInfoLite :user="ques.author" />
            </el-affix>
        </div>
        <AnswerQuestionForm :question="ques.article.title" :question-id="ques.article.articleId" />
    </div>
</template>
