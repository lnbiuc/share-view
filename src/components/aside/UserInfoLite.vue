<script setup lang="ts">
import { formatTime, toPercent } from '../../utils';
import { PropType } from 'vue';
import { UserLiteEntity } from '../../axios/api/articleApi';

const props = defineProps({
    user: {
        type: Object as PropType<UserLiteEntity>,
        required: true,
    },
});
const subStrTime = (time: string) => {
    return time.substring(0, 10);
};
</script>

<template>
    <div class="bg-light rounded-md shadow-sm mb-2 p-4 dark:bg-dark">
        <div class="flex flex-grow justify-center mb-4">
            <el-avatar :size="150" :src="user.avatar" />
        </div>
        <div class="flex flex-col text-left">
            <span class="text-xl font-bold mt-1 dark:text-dark">{{ user.username }}</span>
            <span class="text-sm text-gray-400 mt-1">@{{ user.userId }}</span>
            <span class="user-info-text"
                >Register :
                <span v-text="formatTime(user.registerTime)"></span>
            </span>
            <span class="user-info-text"
                >Last Online :
                <span v-text="subStrTime(user.lastLogin)"></span>
            </span>
            <span class="user-info-text">IP : {{ user.ipAddr }}</span>
            <span class="user-info-text"> Level : {{ Math.floor(toPercent(user.level)) }} </span>
        </div>
    </div>
</template>
<style scoped>
.user-info-text {
    @apply text-sm text-gray-400 my-0.5;
}
</style>
