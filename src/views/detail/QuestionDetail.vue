<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { ArticleContentEntity, getOneArticle } from '../../axios/api/articleApi';
import { formatTime } from '../../utils';
import { AnswerAndCommentEntity, getAnswersByArticleId } from '../../axios/api/answerApi';
import { getCommentsById } from '../../axios/api/commentsApi';
import { ElMessage } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { useDialogControlStore, useReloadCommentStore, useThemeStore } from '../../pinia';
import { subscribeAuthorByAuthorId, subscribeQuestionById } from '../../axios/api/subscribeApi';
import { addCollection } from '../../axios/api/collectApi';
import { storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import DefaultDetailLayout from '../../layout/DefaultDetailLayout.vue';

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
        comments: [],
    },
]);
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

const themeStore = useThemeStore();
const refThemeStore = storeToRefs(themeStore);
const currentTheme = ref<'dark' | 'light'>(themeStore.isDark ? 'dark' : 'light');
watch(refThemeStore.isDark, (val) => {
    currentTheme.value = val ? 'dark' : 'light';
});

const state = reactive({
    id: 'my-editor',
});
</script>

<template>
    <div>
        <DefaultDetailLayout>
            <template #left>
                <div class="flex flex-col p-6 dark:bg-dark rounded-md bg-light shadow-sm">
                    <div class="flex flex-row items-center">
                        <span
                            class="rounded-full py-1 px-2 w-16 text-sm text-center dark:text-light"
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
                        <span class="my-2 text-xl leading-8 dark:text-dark">{{ ques.article.title }}</span>
                    </div>
                    <!--                    <div class="text-sm mb-2 text-gray-500">-->
                    <!--                        <span class="text-sm font-semibold">-->
                    <!--                            {{ ques.article.author.username }}-->
                    <!--                        </span>-->
                    <!--                        <span> @{{ ques.article.author.userId }} </span>-->
                    <!--                        &nbsp;·&nbsp;-->
                    <!--                        <span v-html="formatTime(ques.article.releaseTime)" />-->
                    <!--                        &nbsp;·&nbsp;-->
                    <!--                        <span> Publish On {{ ques.article.author.ipAddr }} </span>-->
                    <!--                    </div>-->
                    <!--                    <div class="my-2">-->
                    <!--                                            <subscribe-btn-->
                    <!--                                                :is-subscribed="ques.article.author.isSubscribed"-->
                    <!--                                                :user-id="ques.article.author.userId"-->
                    <!--                                                :question-id="ques.article.articleId"-->
                    <!--                                                type="user"-->
                    <!--                                            />-->
                    <!--                        <el-button @click="addQuestionCollection(ques.article.articleId)" :disabled="addCollectionBtn"-->
                    <!--                            >Collect-->
                    <!--                        </el-button>-->
                    <!--                    </div>-->
                    <user-profile :user="ques.article.author">
                        <subscribe-btn
                            :is-subscribed="ques.article.author.isSubscribed"
                            :user-id="ques.article.author.userId"
                            :question-id="ques.article.articleId"
                            type="question"
                        />
                    </user-profile>
                    <div class="mb-4">
                        <md-editor
                            :editor-id="state.id"
                            :show-code-row-number="true"
                            v-model="ques.article.content"
                            :theme="currentTheme"
                            :preview-only="true"
                            preview-theme="cyanosis"
                        />
                    </div>
                    <div class="flex justify-between items-center dark:bg-neutral-900 p-3 rounded-md">
                        <div>
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
                        <div class="text-xs mt-3 mx-2 flex flex-row justify-between">
                            <span class="text-gray-500">Publish On: {{ a.releaseTime }} </span>
                            <span>
                                Last Modify:
                                <span v-text="formatTime(a.lastUpdate)" />
                            </span>
                        </div>
                        <div class="mt-3 flex flex-row">
                            <LikeBtn :id="a.id" :type="2" />
                            <CommentsLink :comments="a.comments.length" @click="getComments(a.id)" />
                            <ShareLink />
                            <CollectionLink :type="1" :id="a.id" />
                        </div>
                        <div v-if="showComments(a.id)">
                            <Comment
                                :comments="comments"
                                :article-id="a.id"
                                :title="a.author.username + '\'s Answer'"
                            />
                        </div>
                        <el-divider />
                    </div>
                </div>
            </template>
            <template #right>
                <el-affix :offset="8">
                    <UserInfoLite :user="ques.article.author" />
                </el-affix>
            </template>
        </DefaultDetailLayout>
        <AnswerQuestionForm :question-title="ques.article.title" :question-id="ques.article.articleId" />
    </div>
</template>
