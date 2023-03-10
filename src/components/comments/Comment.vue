<script setup lang="ts">
import { formatTime } from '../../utils';
// @ts-ignore
import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue';
import { useDialogControlStore } from '../../pinia';
import { likeArticle } from '../../axios/api/likesApi';
import { ElMessage } from 'element-plus';

const props = defineProps({
    comments: {
        type: Object,
    },
    title: {
        type: String,
        default: '',
    },
    articleId: {
        type: String,
        default: '',
    },
});

const hasChildren = (arr: []) => {
    return arr && arr.length > 0;
};

const handleCommentToArticle = () => {
    const dialogControlStore = useDialogControlStore();
    dialogControlStore.commentForm.displayInfo = props.title;
    dialogControlStore.commentForm.status = true;
    dialogControlStore.commentForm.data.articleId = props.articleId;
    dialogControlStore.commentForm.data.level = 0;
};

const handleCreateChildComment = (info: string, id: number) => {
    const dialogControlStore = useDialogControlStore();
    dialogControlStore.commentForm.displayInfo = info;
    dialogControlStore.commentForm.status = true;
    dialogControlStore.commentForm.data.toCommentId = id;
    dialogControlStore.commentForm.data.level = 1;
    dialogControlStore.commentForm.data.articleId = props.articleId;
};

const handleCreateChildChildComment = (info: string, id: number) => {
    const dialogControlStore = useDialogControlStore();
    dialogControlStore.commentForm.displayInfo = info;
    dialogControlStore.commentForm.status = true;
    dialogControlStore.commentForm.data.toCommentId = id;
    dialogControlStore.commentForm.data.level = 1;
    dialogControlStore.commentForm.data.articleId = props.articleId;
};

const handleClickLike = (commentId: string) => {
    likeArticle(commentId, 1, 1).then((res) => {
        if (res.data.code == 200) {
            // TODO emit get  comment
            ElMessage.success('SUCCESS');
        } else {
            ElMessage.warning(res.data.message);
        }
    });
};
</script>

<template>
    <CommentForm />
    <div>
        <div
            class="flex flex-row justify-between items-center mt-2 bg-gray-100 dark:bg-neutral-900 p-2 rounded-md shadow-sm"
        >
            <div class="text-gray-400">
                Total Comment : <span class="text-blue-500">{{ comments?.length }}</span>
            </div>
            <el-button @click="handleCommentToArticle()">Create Comment</el-button>
        </div>
        <div
            v-for="c in comments"
            class="my-2 flex flex-row dark:border-neutral-800 bg-gray-50 hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 transition-all rounded-md p-2"
        >
            <div class="flex w-2/12 justify-center items-start">
                <el-avatar :src="c.user.avatar" :size="70" />
            </div>
            <div class="flex flex-col ml-2 w-10/12">
                <div class="flex flex-row">
                    <div class="flex flex-row flex-1 overflow-clip items-center">
                        <span class="text-xl mr-1 hover:text-blue-500 cursor-pointer transition-all dark:text-dark">
                            {{ c.user.username }}
                        </span>
                        <span class="text-xs text-gray-500 hover:text-blue-500 cursor-pointer transition-all">
                            @{{ c.user.userId }}
                        </span>
                        <span class="text-sm text-gray-500 ml-2">IP:{{ c.user.ipAddr }} </span>
                    </div>
                </div>
                <div class="my-1">
                    <span class="break-word dark:text-dark">{{ c.content }}</span>
                </div>
                <div class="flex flex-row justify-between items-center">
                    <div class="text-sm text-gray-500 justify-end">
                        <span v-text="formatTime(c.createTime)"></span>
                    </div>
                    <div class="flex flex-row">
                        <div
                            class="flex flex-row items-center mr-2 text-sm text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
                        >
                            <el-icon color="blue" v-if="c.isLiked" @click="handleClickLike(c.id)">
                                <i-mdi-like />
                            </el-icon>
                            <i-mdi-like v-if="!c.isLiked" />
                            <span class="ml-1"> {{ c.likesCount }} </span>
                        </div>
                        <div
                            @click="handleCreateChildComment(c.content, c.id)"
                            class="flex flex-row items-center mr-2 text-sm text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
                        >
                            <i-material-symbols-comment />
                            <span class="ml-1 text-gray-500"> Replay </span>
                        </div>
                    </div>
                </div>
                <div v-if="hasChildren(c.childComments)">
                    <div v-for="z in c.childComments" class="flex flex-row mr-2 mt-2">
                        <div class="mr-2">
                            <el-avatar :src="z.user.avatar" size="large" />
                        </div>
                        <div class="flex flex-col justify-between flex-grow">
                            <div class="items-center">
                                <span class="hover:text-blue-500 cursor-pointer transition-all">
                                    {{ z.user.username }}
                                </span>
                                <span class="text-xs text-gray-400"> @{{ z.user.userId }} </span>
                                <span class="text-gray-400"> IP:{{ z.user.ipAddr }} </span>
                                <span class="dark:text-dark"> Reply to </span>
                                <span class="text-blue-400 hover:text-blue-500 cursor-pointer transition-all">
                                    @{{ z.toUser.username }}
                                </span>
                                :
                                <div class="break-all my-2">{{ z.content }}</div>
                            </div>
                            <div class="flex flex-row justify-between">
                                <div>
                                    <span class="mr-2 text-xs text-gray-500" v-text="formatTime(z.createTime)" />
                                </div>
                                <div class="flex flex-row">
                                    <div
                                        class="flex flex-row items-center mr-2 text-xs text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
                                    >
                                        <el-icon color="blue" v-if="z.isLiked">
                                            <i-mdi-like />
                                        </el-icon>
                                        <i-mdi-like v-if="!z.isLiked" />
                                        <span class="ml-1"> {{ z.likesCount }} </span>
                                    </div>
                                    <div
                                        @click="handleCreateChildChildComment(z.content, c.id)"
                                        class="flex flex-row items-center mr-2 text-xs text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
                                    >
                                        <i-material-symbols-comment />
                                        <span class="ml-1 text-gray-500"> Replay </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
