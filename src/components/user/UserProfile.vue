<script setup lang="ts">
import { UserLiteEntity } from '../../axios/api/articleApi';
import { PropType } from 'vue';

const props = defineProps({
    user: {
        type: Object as PropType<UserLiteEntity>,
        required: true,
        default: {
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
    },
});
</script>

<template>
    <div class="flex flex-row justify-between">
        <div class="flex flex-row items-center">
            <div class="flex flex-col items-center justify-center">
                <el-avatar :src="props.user?.avatar" :size="80" class="shadow-md" />
            </div>
            <div class="flex flex-col ml-4">
                <div class="flex flex-row mb-2 items-center justify-between">
                    <div>
                        <span class="title text-2xl" @click="$router.push('/u/p/' + props.user?.userId)">
                            {{ props.user.username }}</span
                        >
                        <span class="text-sm ml-1 text-gray-400">@{{ props.user.userId }}</span>
                    </div>
                    <div class="flex flex-row items-start">
                        <slot />
                    </div>
                </div>
                <div>
                    <span class="text-xs dark:text-dark">{{ props.user.signature }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
