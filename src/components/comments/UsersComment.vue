<script setup lang="ts">
import { PropType } from 'vue';
import { UserCommentEntity } from '../../axios/api/commentsApi';
import { formatTime } from '../../utils';

defineProps({
    comment: {
        type: Object as PropType<UserCommentEntity[]>,
        required: true,
    },
});
</script>

<template>
    <div
        v-for="(c, index) in comment"
        :key="c.commentId"
        class="flex flex-col dark:bg-dark border-light dark:border-dark rounded-md ml-2 mr-4 mt-2 px-4 py-3"
    >
        <div class="flex flex-row w-full flex-grow py-2 mb-2">
            <div class="mr-2">
                <span class="rounded-md px-2 py-1 whitespace-nowrap bg-blue-400 opacity-80" v-if="!c.toCommentContent">
                    To Article
                </span>
                <span class="rounded-md px-2 py-1 whitespace-nowrap bg-orange-300 opacity-80" v-if="c.toCommentContent">
                    To User
                </span>
            </div>
            <div v-if="!c.toCommentContent" class="overflow-hidden">
                <span class="font-semibold title whitespace-nowrap">
                    {{ c.toArticleTitle }}
                </span>
            </div>
            <div v-else class="">
                <span class="font-semibold title">
                    {{ c.toUser.username }}
                </span>
                <span class="text-xs text-gray-400"> @{{ c.toUser.userId }} </span>
            </div>
            <div></div>
        </div>
        <div v-if="c.toCommentContent" class="flex flex-row break-words items-center">
            <el-icon :size="20" color="violet" class="mr-1">
                <i-ant-design-message-outlined />
            </el-icon>
            <span class="text-sm">
                <span class="text-gray-800 overflow-ellipsis"> Origin : </span>
                {{ c.toCommentContent }}
            </span>
        </div>
        <div class="flex flex-row break-words items-center">
            <el-icon :size="20" color="green" class="mr-1">
                <i-ant-design-message-outlined />
            </el-icon>
            <span class="text-sm">
                <span class="text-gray-800"> Replay : </span>
                {{ c.content }}
            </span>
        </div>
        <div class="flex flex-row justify-between mt-2 ml-1">
            <span class="text-sm text-gray-400"> {{ formatTime(c.createTime) }} · {{ c.createTime }} </span>
            <div
                v-if="c.toCommentContent"
                class="font-semibold text-blue-400 cursor-pointer hover:text-blue-500 transition-all"
            >
                Visit Source
            </div>
        </div>
    </div>
</template>
