<script setup lang="ts">
import { formatTime } from '../../utils';

const props = defineProps({
    user: {
        type: Object,
        default: {},
    },
});
const subStrTime = (time: string) => {
    return time.substring(0, 10);
};
</script>

<template>
    <div class="bg-white rounded-md shadow-sm mb-2 p-4 dark:bg-dark">
        <el-avatar :size="130" :src="user.avatar" />
        <div class="flex flex-col text-left">
            <span class="text-xl font-bold mt-1 dark:text-dark">{{ user.username }}</span>
            <span class="text-sm text-gray-400">@{{ user.userId }}</span>
            <span class="text-sm text-gray-400 my-1">Signature:{{ user.signature }}</span>
            <span class="text-sm text-gray-400"
                >Register:
                <span v-text="formatTime(user.registerTime)"></span>
            </span>
            <span class="text-sm text-gray-400"
                >Last Online:
                <span v-text="subStrTime(user.lastLogin)"></span>
            </span>
            <span class="text-sm text-gray-400">IP:{{ user.ipAddr }}</span>
        </div>
    </div>
</template>
