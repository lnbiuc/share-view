<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { ArticleContentEntity, getOneArticle } from '../../axios/api/articleApi';
import { formatTime } from '../../utils';
import { AnswerAndCommentEntity, getAnswersByArticleId } from '../../axios/api/answerApi';
import { getCommentsById } from '../../axios/api/commentsApi';
import { ElMessage } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { useDialogControlStore, useReloadCommentStore, useThemeStore } from '../../pinia';
import { storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import DefaultDetailLayout from '../../layout/DefaultDetailLayout.vue';
import { addCollection } from '../../axios/api/collectApi';

const articleId = useRouteParams<string>('questionId');
const ques: Ref<ArticleContentEntity> = ref({
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
        total: 0,
        data: [],
    },
});
const answer: Ref<AnswerAndCommentEntity[]> = ref([
    {
        id: '',
        toId: '',
        author: {
            userId: '',
            username: '',
            signature: '',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            level: 0,
            registerTime: '',
            lastLogin: '',
            ipAddr: '',
            isSubscribed: false,
        },
        content: '',
        releaseTime: '',
        lastUpdate: '',
        like: 0,
        dislike: 0,
        comments: {
            pageNumber: 0,
            pageSize: 0,
            currentSize: 0,
            total: 0,
            data: [],
        },
        showComment: false,
    },
]);
const isLoading = ref<boolean>(true);

onMounted(() => {
    isLoading.value = true;
    getOneArticle(articleId.value).then((res) => {
        if (res.data.code == 200) {
            ques.value = res.data.data;
            isLoading.value = false;
            getAnswer();
        }
    });
});
const getAnswer = () => {
    isLoading.value = true;
    getAnswersByArticleId(articleId.value, params.value.pageNumber, params.value.pageSize, params.value.order).then(
        (res) => {
            if (res.data.code == 200) {
                isLoading.value = false;
                answer.value = res.data.data.data;
                params.value.total = res.data.data.total;
            }
        }
    );
};

const showComments = (id: string) => {
    const targetAnswer = answer.value.find((item) => item.id === id);
    if (targetAnswer) {
        targetAnswer.showComment = !targetAnswer.showComment;
        commentParams.value.total = targetAnswer?.comments.total;
    }
};
const currentSortSelect = ref('LIKE');
const sortChange = (type: string) => {
    if (type == 'LIKE') {
        currentSortSelect.value = 'LIKE';
        params.value.order = 'like';
    } else {
        currentSortSelect.value = 'NEW';
        params.value.order = 'new';
    }
};

watch(currentSortSelect, () => {
    params.value.pageNumber = 1;
    getAnswer();
});

const dialogControlStore = useDialogControlStore();

const refreshAnswers = () => {
    if (params.value.order === 'new') {
        params.value.pageNumber = 1;
    }
    isLoading.value = true;
    getAnswersByArticleId(articleId.value, params.value.pageNumber, params.value.pageSize, params.value.order).then(
        (res) => {
            if (res.data.code == 200) {
                isLoading.value = false;
                answer.value = res.data.data.data;
                params.value.total = res.data.data.total;
            }
        }
    );
};

const params = ref<{ pageNumber: number; pageSize: number; total: number; order: 'like' | 'new' }>({
    pageNumber: 1,
    pageSize: 10,
    total: 0,
    order: 'like',
});

const answerCurrentChange = (pageNumber: number) => {
    params.value.pageNumber = pageNumber;
    getAnswer();
};

const themeStore = useThemeStore();
const refThemeStore = storeToRefs(themeStore);
const currentTheme = ref<'dark' | 'light'>(themeStore.isDark ? 'dark' : 'light');
watch(refThemeStore.isDark, (val) => {
    currentTheme.value = val ? 'dark' : 'light';
});

const state = reactive({
    id: 'my-editor-answer',
});

const handleOnLikeSuccess = () => {
    refreshAnswers();
};

const handleOnDisLikeSuccess = () => {
    refreshAnswers();
};

const commentParams = ref<{ answerId: string; pageNumber: number; pageSize: number; total: number }>({
    answerId: '',
    pageNumber: 1,
    pageSize: 10,
    total: 0,
});

const reloadCommentStore = useReloadCommentStore();
const refReloadCommentStore = storeToRefs(reloadCommentStore);
watch(refReloadCommentStore.count, () => {
    getComments(refReloadCommentStore.reload.value);
});

const getComments = (id: string) => {
    commentParams.value.answerId = id;
    commentParams.value.pageNumber = 1;
    getCommentsById(commentParams.value.answerId, commentParams.value.pageNumber, commentParams.value.pageSize).then(
        (res) => {
            if (res.data.code == 200) {
                const targetAnswer = answer.value.find((item) => item.id === id);
                if (targetAnswer) {
                    targetAnswer.comments = res.data.data;
                }
            } else {
                ElMessage.warning(res.data.message);
            }
        }
    );
};

const handleAddCollection = (articleId: string) => {
    addCollection(articleId, 2).then((res) => {
        if (res.data.code == 200) {
            ElMessage.success('add collection success');
        } else {
            ElMessage.warning(res.data.message);
        }
    });
};

const commentCurrentChange = (pageNumber: number, answerId: string) => {
    getCommentsById(answerId, pageNumber, commentParams.value.pageSize).then((res) => {
        commentParams.value.answerId = answerId;
        if (res.data.code == 200) {
            const targetAnswer = answer.value.find((item) => item.id === answerId);
            commentParams.value.pageNumber = pageNumber;
            if (targetAnswer) {
                targetAnswer.comments = res.data.data;
            }
        } else {
            ElMessage.warning(res.data.message);
        }
    });
};

const handleOpenCommentForm = (answerId: string) => {
    commentParams.value.answerId = answerId;
    answer.value = answer.value.map((answer) => {
        answer.showComment = answer.id === answerId;
        return answer;
    });
};
</script>

<template>
    <DefaultDetailLayout>
        <template #left>
            <loading :is-loading="isLoading" />
            <div class="flex flex-col p-6 dark:bg-dark rounded-md bg-light shadow-sm">
                <div class="flex flex-row items-center">
                    <div
                        class="rounded-full py-1 px-2 w-16 text-sm text-center dark:text-light"
                        style="background-color: #95d475"
                    >
                        Question
                    </div>
                    <div class="ml-2 flex flex-row items-center">
                        <el-tag size="large" class="mx-1" v-for="t in ques.article.tags" :key="t.tagId">
                            {{ t.tagName }}
                        </el-tag>
                    </div>
                </div>
                <div class="my-4 mt-6">
                    <span class="leading-8 dark:text-dark text-2xl">{{ ques.article.title }}</span>
                </div>
                <el-divider>AUTHOR</el-divider>
                <user-profile :user="ques.article.author" class="mb-2">
                    <subscribe-btn
                        :is-subscribed="ques.article.author.isSubscribed"
                        :user-id="ques.article.author.userId"
                        :question-id="ques.article.articleId"
                        type="question"
                    />
                </user-profile>
                <el-divider>QUESTION</el-divider>
                <div class="mb-4">
                    <md-editor
                        :editor-id="state.id"
                        :show-code-row-number="true"
                        v-model="ques.article.content"
                        :theme="currentTheme"
                        :preview-only="true"
                        preview-theme="smart-blue"
                    />
                </div>
                <div class="flex justify-between items-center dark:bg-neutral-900 p-3 rounded-md">
                    <div class="flex flex-row items-center">
                        <span
                            class="text-neutral-700 bg-gray-200 px-3 py-1 rounded-full text-sm dark:bg-dark dark:text-gray-300"
                        >
                            Total :
                            <span class="text-blue-500">{{ params.total }}</span>
                            Answers
                        </span>
                        <el-button class="ml-4" type="warning" @click="handleAddCollection(ques.article.articleId)">
                            Add Collection
                        </el-button>
                        <el-button
                            class="ml-4"
                            type="primary"
                            @click="dialogControlStore.answerQuestionForm.status = true"
                            >Create Answer
                        </el-button>
                    </div>
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link align-top cursor-pointer">
                            <el-button>
                                {{ currentSortSelect }}
                                <el-icon><ArrowDown /></el-icon>
                            </el-button>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="sortChange('LIKE')" :disabled="currentSortSelect === 'LIKE'"
                                    >LIKE
                                </el-dropdown-item>
                                <el-dropdown-item @click="sortChange('NEW')" :disabled="currentSortSelect === 'NEW'"
                                    >NEW
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <div class="mt-2 py-4 rounded-md dark:bg-dark" v-for="a in answer" :key="a.id">
                <el-divider>ANSWER</el-divider>
                <div class="px-6">
                    <user-profile :user="a.author" class="mb-2">
                        <subscribe-btn :is-subscribed="a.author.isSubscribed" :user-id="a.author.userId" type="user" />
                    </user-profile>
                </div>

                <el-divider />
                <md-editor
                    :editor-id="state.id"
                    preview-theme="cyanosis"
                    :show-code-row-number="true"
                    v-model="a.content"
                    :theme="currentTheme"
                    :preview-only="true"
                />
                <div class="text-xs mt-3 mx-2 flex flex-row justify-between">
                    <span class="text-gray-500">Publish On: {{ a.releaseTime }} </span>
                    <div v-if="a.releaseTime !== a.lastUpdate">
                        <span class="text-gray-500">
                            Last Modify:
                            <span v-text="formatTime(a.lastUpdate)" />
                        </span>
                    </div>
                </div>
                <div class="mt-3 px-6 flex flex-row">
                    <LikeBtn
                        :id="a.id"
                        :type="2"
                        :like="a.like"
                        :dislike="a.dislike"
                        @on-like-success="handleOnLikeSuccess"
                        @on-dislike-success="handleOnDisLikeSuccess"
                    />
                    <CommentsLink :comments="a.comments.total" @click="showComments(a.id)" />
                    <ShareLink :article-id="articleId" :article-type="'Question'" />
                </div>
                <div v-if="a.showComment" class="px-6">
                    <Comment
                        :comments="a.comments"
                        :article-id="a.id"
                        :total="a.comments.total"
                        :title="a.author.username + '\'s Answer'"
                        @on-open-comment-form="handleOpenCommentForm(a.id)"
                    />
                    <Pagination
                        :current-page="commentParams.pageNumber"
                        :page-size="commentParams.pageSize"
                        :total="a.comments.total"
                        @numberChange="(pageNumber: number) => {
                                commentCurrentChange(pageNumber, a.id);
                            }"
                        :hide-on-single-page="true"
                    />
                </div>
            </div>
            <Pagination
                :current-page="params.pageNumber"
                :page-size="params.pageSize"
                :total="params.total"
                @numberChange="answerCurrentChange"
                :hide-on-single-page="true"
            />
        </template>
        <template #right>
            <el-affix :offset="8">
                <UserInfoLite :user="ques.article.author" />
            </el-affix>
        </template>
    </DefaultDetailLayout>
    <AnswerQuestionForm
        :question-title="ques.article.title"
        :question-id="ques.article.articleId"
        @on-publish-success="refreshAnswers"
    />
</template>
