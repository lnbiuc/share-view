<template>
    <div class="flex flex-col bg-white mt-2 rounded-md hover:shadow-md transition-all shadow-sm p-3">
        <div class="flex flex-row">
            <div class="flex flex-1">
                <img
                    :src="user.avatar"
                    alt=""
                    class="w-auto rounded-md shadow-sm hover:shadow-md transition-all"
                />
            </div>
            <div class="flex flex-1 flex-col mt-20 text-left ml-4">
                <span class="text-lg">&nbsp;{{ user.username }}</span>
                <span class="text-sm m-0.5 ml-1"
                    >Lv:&nbsp;<el-tag style="border: none" class="ml-1">Lv{{ levelStart }}</el-tag></span
                >
                <span class="text-sm m-0.5 text-gray-400">@{{ user.userId }}</span>
                <span class="text-sm text-gray-400">&nbsp;IP: {{ user.ipAddr }}</span>
            </div>
        </div>
        <div class="flex flex-row mt-3 ml-1 text-left">
            Signature:&nbsp;<span>{{ user.signature }}</span>
        </div>
        <div class="flex flex-col mt-2 mx-1">
            <div class="flex flex-row justify-between items-center">
                <span class="text-sm">Lv：{{ levelStart }}</span>
                <span class="text-sm">Lv：{{ levelEnd }}</span>
            </div>
            <div class="mt-1">
                <el-progress :percentage="level" :show-text="false" />
            </div>
            <div class="mt-4 mb-2 flex flex-row justify-around">
                <div v-for="c in countInfo" class="flex flex-col">
                    <span class="text-lg text-blue-400 font-bold">{{ c.value }}</span>
                    <span class="mt-1">{{ c.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../../pinia';
import { onMounted, ref } from 'vue';
import { userEntity, CountEntity } from "../../api/login/loginApi";

const props = defineProps<{
    user: userEntity,
    count: CountEntity
}>()

const store = useUserStore();
const level = ref<number>(0);
const levelStart = ref<number>(0);
const levelEnd = ref<number>(0);
onMounted(() => {
    level.value = props.user.level * 10;
    levelStart.value = parseInt(props.user.level / 10 + '') + 1;
    levelEnd.value = parseInt(props.user.level / 10 + '') + 2;
});
console.log(props.count.like)
const countInfo = ref<{ value: number; name: string }[]>([
    {
        name: 'Publish',
        value: props.count.publish
    },
    {
        name: 'Like',
        value: props.count.like
    },
    {
        name: 'Collection',
        value: props.count.collection
    },
]);
</script>
