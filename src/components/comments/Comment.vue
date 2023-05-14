<script setup lang="ts">
import { checkLoginStatus, formatTime } from '../../utils';
import { useDialogControlStore, useReloadCommentStore, useThemeStore } from '../../pinia';
import { likeArticle } from '../../axios/api/likesApi';
import { ElMessage } from 'element-plus';
import { PropType } from 'vue';
import { ChildComment, CommentsEntity } from '../../axios/api/commentsApi';

const props = defineProps({
    comments: {
        type: Object as PropType<CommentsEntity>,
    },
    title: {
        type: String,
        default: '',
    },
    articleId: {
        type: String,
        default: '',
    },
    total: {
        type: Number,
        default: 0,
    },
});

const hasChildren = (arr: ChildComment[]) => {
    return arr && arr.length > 0;
};

const handleCommentToArticle = () => {
    if (checkLoginStatus()) {
        emit('on-open-comment-form');
        const dialogControlStore = useDialogControlStore();
        dialogControlStore.commentForm.displayInfo = props.title;
        dialogControlStore.commentForm.status = true;
        dialogControlStore.commentForm.data.articleId = props.articleId;
        dialogControlStore.commentForm.data.level = 0;
    }
};

const handleCreateChildComment = (info: string, id: number) => {
    if (checkLoginStatus()) {
        emit('on-open-comment-form');
        const dialogControlStore = useDialogControlStore();
        dialogControlStore.commentForm.displayInfo = info;
        dialogControlStore.commentForm.status = true;
        dialogControlStore.commentForm.data.toCommentId = id;
        dialogControlStore.commentForm.data.level = 1;
        dialogControlStore.commentForm.data.articleId = props.articleId;
    }
};

const handleCreateChildChildComment = (info: string, id: number) => {
    if (checkLoginStatus()) {
        emit('on-open-comment-form');
        const dialogControlStore = useDialogControlStore();
        dialogControlStore.commentForm.displayInfo = info;
        dialogControlStore.commentForm.status = true;
        dialogControlStore.commentForm.data.toCommentId = id;
        dialogControlStore.commentForm.data.level = 1;
        dialogControlStore.commentForm.data.articleId = props.articleId;
    }
};
const handleClickLike = (commentId: number, isLike: number) => {
    if (checkLoginStatus()) {
        likeArticle(commentId.toString(), 1, isLike).then((res) => {
            if (res.data.code == 200) {
                const commentStore = useReloadCommentStore();
                commentStore.reload = props.articleId;
                commentStore.increase();
                ElMessage.success('SUCCESS');
            } else {
                ElMessage.warning(res.data.message);
            }
        });
    }
};

const emit = defineEmits(['on-open-comment-form']);

const themeStore = useThemeStore();
</script>

<template>
    <CommentForm />
    <div>
        <div
            class="flex flex-row justify-between items-center mt-2 bg-gray-100 dark:bg-neutral-900 p-2 rounded-md shadow-sm"
        >
            <div class="text-gray-500 pl-1">
                Total Comment : <span class="text-blue-500">{{ total }}</span>
            </div>
            <el-button plain bg color="#626aef" :dark="themeStore.isDark" @click="handleCommentToArticle()"
                >Create Comment</el-button
            >
        </div>
        <div
            v-for="comment in comments!.data"
            :key="comment.id"
            class="my-2 flex flex-row dark:border-neutral-800 transition-all rounded-md p-2 bg-gray-50 dark:bg-neutral-900"
        >
            <div class="flex justify-center items-start my-2 mx-1">
                <el-avatar :src="comment.user.avatar" :size="70" />
            </div>
            <div class="flex flex-col ml-2 flex-grow">
                <div class="flex flex-row">
                    <div class="flex flex-row flex-1 overflow-clip items-center">
                        <span class="text-xl mr-1 hover:text-blue-500 cursor-pointer transition-all">
                            {{ comment.user.username }}
                        </span>
                        <span class="text-xs text-gray-500"> @{{ comment.user.userId }} </span>
                        <span class="text-sm text-gray-500 ml-2"> {{ comment.user.ipAddr }} </span>
                    </div>
                </div>
                <div class="my-1">
                    <span class="break-word dark:text-dark">{{ comment.content }}</span>
                </div>
                <div class="flex flex-row justify-between items-center">
                    <div class="flex flex-row my-1">
                        <div
                            class="flex flex-row items-center mr-2 text-sm text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
                        >
                            <div
                                class="flex flex-row items-center justify-center"
                                v-if="comment.isLiked"
                                @click="handleClickLike(comment.id, 0)"
                            >
                                <el-icon color="#3B82F6" :size="18" class="mb-[3px]">
                                    <i-ant-design-like-filled />
                                </el-icon>
                                <span class="ml-1 text-blue-500"> {{ comment.likesCount }} </span>
                            </div>
                            <div
                                class="flex flex-row justify-center items-center"
                                v-if="!comment.isLiked"
                                @click="handleClickLike(comment.id, 1)"
                            >
                                <el-icon :size="18" class="mb-[3px]">
                                    <i-ant-design-like-outlined />
                                </el-icon>
                                <span class="ml-1"> {{ comment.likesCount }} </span>
                            </div>
                        </div>
                        <div
                            @click="handleCreateChildComment(comment.content, comment.id)"
                            class="flex flex-row items-center mr-2 text-sm text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
                        >
                            <el-icon :size="17">
                                <i-ant-design-message-outlined />
                            </el-icon>
                            <span class="ml-1">Replay</span>
                        </div>
                    </div>
                    <div class="text-sm text-gray-500 justify-end cursor-default">
                        <el-tooltip :content="comment.createTime">
                            {{ formatTime(comment.createTime) }}
                        </el-tooltip>
                    </div>
                </div>
                <div v-if="hasChildren(comment.childComments)">
                    <div
                        v-for="child in comment.childComments"
                        :key="child.id"
                        class="flex flex-row mt-2 p-2 rounded-md bg-gray-100 dark:bg-neutral-800"
                    >
                        <div class="mr-2 p-2">
                            <el-avatar :src="child.user.avatar" size="large" />
                        </div>
                        <div class="flex flex-col justify-between flex-grow">
                            <div class="items-center">
                                <span class="hover:text-blue-500 cursor-pointer transition-all">
                                    {{ child.user.username }}
                                </span>
                                <span class="text-xs text-gray-500"> @{{ child.user.userId }} </span>
                                <span class="text-gray-500 text-sm">&nbsp;{{ child.user.ipAddr }} </span>
                                <span class="dark:text-dark"> Reply to </span>
                                <span class="text-blue-400 hover:text-blue-500 cursor-pointer transition-all">
                                    @{{ child.toUser.username }}
                                </span>
                                :
                                <div class="break-all my-2">{{ child.content }}</div>
                            </div>
                            <div class="flex flex-row justify-between">
                                <div class="flex flex-row">
                                    <div
                                        class="flex flex-row items-center mr-2 text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
                                    >
                                        <div
                                            class="flex flex-row items-center justify-center"
                                            v-if="child.isLiked"
                                            @click="handleClickLike(child.id, 0)"
                                        >
                                            <el-icon color="#3B82F6" :size="17">
                                                <i-ant-design-like-filled />
                                            </el-icon>
                                            <span class="ml-1 text-blue-500"> {{ child.likesCount }} </span>
                                        </div>
                                        <div
                                            class="flex flex-row items-center justify-center"
                                            v-if="!child.isLiked"
                                            @click="handleClickLike(child.id, 1)"
                                        >
                                            <el-icon :size="17">
                                                <i-ant-design-like-outlined />
                                            </el-icon>
                                            <span class="ml-1"> {{ child.likesCount }} </span>
                                        </div>
                                    </div>
                                    <div
                                        @click="handleCreateChildChildComment(child.content, comment.id)"
                                        class="flex flex-row items-center mr-2 text-xs text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
                                    >
                                        <el-icon :size="16" class="mt-[2px]">
                                            <i-ant-design-message-outlined />
                                        </el-icon>
                                        <span class="ml-1">Replay</span>
                                    </div>
                                </div>
                                <div class="cursor-default">
                                    <el-tooltip :content="child.createTime">
                                        <span
                                            class="mr-0.5 text-xs text-gray-500"
                                            v-text="formatTime(child.createTime)"
                                        />
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
