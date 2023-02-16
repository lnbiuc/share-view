<template>
    <div class="flex flex-col bg-white mt-2 dark:bg-dark rounded-md hover:shadow-md transition-all shadow-sm p-3">
        <div class="flex flex-row">
            <div class="flex m-2">
                <el-avatar shape="square" :src="user.avatar" :size="150"/>
            </div>
            <div class="flex flex-col mt-5 text-left ml-4 justify-end">
                <span class="text-lg font-bold">&nbsp;{{ user.username }}</span>
                <span class="text-sm m-0.5 text-gray-400">@{{ user.userId }}</span>
                <span class="text-sm text-gray-400">&nbsp;IP:{{ user.ipAddr }}</span>
            </div>
        </div>
        <div class="flex flex-row mt-3 ml-1 text-left">
            Signature:&nbsp;<span>{{ user.signature }}</span>
        </div>
        <div class="flex flex-col mt-2 mx-1">
            <div class="flex flex-row justify-between items-center">
                <span class="text-sm">Lv:{{ levelStart }}</span>
                <span class="text-sm">Lv:{{ levelEnd }}</span>
            </div>
            <div class="mt-1">
                <el-progress :percentage="level" :show-text="false" />
            </div>
            <div class="mt-4 mb-2 flex flex-row justify-around">
                <div class="flex flex-col">
                    <span class="text-lg text-blue-400 font-bold">{{ count.publish }}</span>
                    <span class="mt-1">Publish</span>
                </div>
                <div class="flex flex-col">
                    <span class="text-lg text-blue-400 font-bold">{{ count.like }}</span>
                    <span class="mt-1">Like</span>
                </div>
                <div class="flex flex-col">
                    <span class="text-lg text-blue-400 font-bold">{{ count.collection }}</span>
                    <span class="mt-1">Collection</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../../pinia';
import { onMounted, ref } from 'vue';
import { UserEntity, CountEntity } from '../../api/login/loginApi';

interface userCount {
    user: UserEntity;
    count: CountEntity;
}

const props = defineProps<userCount>();

const store = useUserStore();
const level = ref<number>(0);
const levelStart = ref<number>(0);
const levelEnd = ref<number>(0);
onMounted(() => {
    level.value = props.user.level * 10;
    levelStart.value = parseInt(props.user.level / 10 + '') + 1;
    levelEnd.value = parseInt(props.user.level / 10 + '') + 2;
});
</script>
