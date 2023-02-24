<script setup lang="ts">
import { formatTime } from '../../utils';
// @ts-ignore
import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue';
import { useDialogControlStore } from '../../pinia';

const props = defineProps({
    comments: {
        type: Object
    },
    title: {
        type: String,
        default: ''
    },
    articleId: {
        type: String,
        default: ''
    }
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

</script>

<template>
    <CommentForm />
    <div>
        <div class="flex flex-row justify-between items-center mt-2 bg-gray-100 p-2 rounded-md shadow-sm">
            <div>
                Total Comment : <span class="text-blue-500">{{ comments?.length }}</span>
            </div>
            <el-button @click="handleCommentToArticle()">Create Comment</el-button>
        </div>
        <div
            v-for="c in comments"
            class="my-2 flex flex-row border-gray-200 dark:border-neutral-800 border-solid border hover:bg-gray-100 dark:hover:bg-neutral-900 transition-all rounded-md p-2"
        >
            <div class="flex w-2/12 justify-center items-start">
                <el-avatar :src="c.user.avatar" :size="70" />
            </div>
            <div class="flex flex-col ml-2 w-10/12">
                <div class="flex flex-row">
                    <div class="flex flex-row flex-1 overflow-clip">
                        <span class="text-md font-semibold hover:text-blue-500 cursor-pointer transition-all">
                            {{ c.user.username }}
                        </span>
                        <span class="text-sm text-gray-500 hover:text-blue-500 cursor-pointer transition-all">
                            @{{ c.user.userId }}
                        </span>
                        <span class="text-sm text-gray-500"> &nbsp;&nbsp;IP:{{ c.user.ipAddr }} </span>
                    </div>
                    <div class="text-sm text-gray-500 justify-end">
                        <span v-text="formatTime(c.createTime)"></span>
                    </div>
                </div>
                <div class="my-1">
                    <span class="break-word">{{ c.content }}</span>
                </div>
                <div class="flex flex-row">
                    <span class="mr-2 text-sm text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
                    >Like</span
                    >
                    <span class="mr-2 text-sm text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
                    >Dislike</span
                    >
                    <span
                        @click="handleCreateChildComment(c.content, c.id)"
                        class="mr-2 text-sm text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
                    >Comment</span
                    >
                </div>
                <div v-if="hasChildren(c.childComments)">
                    <div v-for="z in c.childComments" class="flex flex-row mr-2 mt-2">
                        <div class="mr-2">
                            <el-avatar :src="z.user.avatar" size="large" />
                        </div>
                        <div class="text-sm flex flex-col justify-between">
                            <div>
                                <span class="font-semibold hover:text-blue-500 cursor-pointer transition-all">
                                    {{ z.user.username }}
                                </span>
                                &nbsp;Reply to&nbsp;
                                <span class="text-blue-400 hover:text-blue-500 cursor-pointer transition-all">
                                    @{{ z.toUser.username }}
                                </span>
                                :
                                <div class="break-all my-2">{{ z.content }}</div>
                            </div>
                            <div></div>
                            <div class="flex flex-row">
                                <div>
                                    <span
                                        class="mr-2 text-xs text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
                                    >Like</span
                                    >
                                    <span
                                        class="mr-2 text-xs text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
                                    >Dislike</span
                                    >
                                    <span
                                        @click="handleCreateChildChildComment(z.content, c.id)"
                                        class="mr-2 text-xs text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
                                    >Comment</span
                                    >
                                    <span class="mr-2 text-xs text-gray-500" v-text="formatTime(z.createTime)" />
                                    <span class="mr-2 text-xs text-gray-500"> IP:{{ z.user.ipAddr }} </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
