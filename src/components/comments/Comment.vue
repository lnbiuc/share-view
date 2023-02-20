<script setup lang="ts">
import { formatTime } from '../../utils';
// @ts-ignore
import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue';

const props = defineProps({
    comments: {
        type: Object,
    },
});
const hasChildren = (arr: []) => {
    return arr && arr.length > 0;
};
</script>

<template>
    <div>
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
                    <span class="mr-2 text-sm text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
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
                                <div class="break-all my-2"> {{ z.content }} </div>
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
