<script setup lang="ts">
import { PropType } from 'vue';
import { deleteCommentByCommentId, UserCommentEntity } from '../../axios/api/commentsApi';
import { formatTime, handleToArticleDetail } from '../../utils';
import CommentOptionMenu from '../menu/CommentOptionMenu.vue';
import { ElMessage } from 'element-plus';

defineProps({
    comment: {
        type: Object as PropType<UserCommentEntity[]>,
        required: true,
    },
    executeTime: {
        type: Object as PropType<string[] | null>,
        required: false,
    },
});

const emit = defineEmits(['updateData']);

const handleDelete = (commentId: number) => {
    deleteCommentByCommentId(commentId).then((res) => {
        if (res.data.code == 200) {
            emit('updateData');
        } else {
            ElMessage.error(res.data);
        }
    });
};
</script>

<template>
    <div
        v-for="(c, index) in comment"
        :key="c.commentId"
        class="flex flex-col dark:bg-dark border-light dark:border-dark rounded-md ml-2 mr-2 mt-2 px-4 py-3"
    >
        <div class="flex flex-row w-full flex-grow py-2 mb-2 justify-between">
            <div class="flex flex-row">
                <div class="mr-2">
                    <span
                        class="rounded-md px-2 py-1 dark:text-neutral-800 whitespace-nowrap bg-blue-400 opacity-80"
                        v-if="!c.toCommentContent"
                    >
                        To Article
                    </span>
                    <span
                        class="rounded-md px-2 py-1 dark:text-neutral-800 whitespace-nowrap bg-orange-300 opacity-80"
                        v-if="c.toCommentContent"
                    >
                        To User
                    </span>
                </div>
                <div v-if="!c.toCommentContent" class="overflow-hidden">
                    <span
                        class="font-semibold title whitespace-nowrap"
                        @click="handleToArticleDetail(c.type, c.toArticleId, $router)"
                    >
                        {{ c.toArticleTitle }}
                    </span>
                </div>
                <div v-else class="">
                    <span class="font-semibold title">
                        {{ c.toUser ? c.toUser.username : '' }}
                    </span>
                    <span class="text-xs text-gray-400"> @{{ c.toUser ? c.toUser.userId : '' }} </span>
                </div>
            </div>
            <div class="flex flex-row pl-2">
                <comment-option-menu @handle-delete="handleDelete(c.commentId)" />
            </div>
        </div>
        <div v-if="c.toCommentContent" class="flex flex-row break-words items-center">
            <el-icon :size="20" color="violet" class="mr-1">
                <i-ant-design-message-outlined />
            </el-icon>
            <span class="text-sm dark:text-dark">
                <span class="text-gray-800 overflow-ellipsis dark:text-dark dark:text-dark"> Origin : </span>
                {{ c.toCommentContent }}
            </span>
        </div>
        <div class="flex flex-row break-words items-center">
            <el-icon :size="20" color="green" class="mr-1">
                <i-ant-design-message-outlined />
            </el-icon>
            <span class="text-sm dark:text-dark">
                <span class="text-gray-800 dark:text-dark"> Replay : </span>
                {{ c.content }}
            </span>
        </div>
        <div class="flex flex-row justify-between mt-2 ml-1">
            <span class="text-sm text-gray-400" v-if="!executeTime">
                {{ formatTime(c.createTime) }} · {{ c.createTime }}
            </span>
            <span class="text-sm text-gray-400" v-if="executeTime">
                {{ formatTime(executeTime[index]) }} · {{ executeTime[index] }}
            </span>
            <div
                class="font-semibold text-blue-400 cursor-pointer hover:text-blue-500 transition-all"
                @click="handleToArticleDetail(c.type, c.toArticleId, $router)"
            >
                Visit Source
            </div>
        </div>
    </div>
</template>
