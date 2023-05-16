<script setup lang="ts">
import { PropType, ref } from 'vue';
import { UserLikedAnswerEntity } from '../../axios/api/likesApi';
import MdEditor from 'md-editor-v3';
import { useThemeStore } from '../../pinia';
import { storeToRefs } from 'pinia';
import { formatTime } from '../../utils';

defineProps({
    answerList: {
        type: Object as PropType<UserLikedAnswerEntity[]>,
        require: true,
    },
});

const themeStore = useThemeStore();
const refThemeStore = storeToRefs(themeStore);
const currentTheme = ref<'dark' | 'light'>(themeStore.isDark ? 'dark' : 'light');
watch(refThemeStore.isDark, (val) => {
    currentTheme.value = val ? 'dark' : 'light';
});
</script>

<template>
    <div
        v-for="(a, index) in answerList"
        :key="a.answerId"
        class="flex flex-col mr-4 rounded-md border-light dark:border-dark p-4 mb-2 dark:bg-dark"
    >
        <div class="p-4 bg-gray-100 rounded-md dark:bg-neutral-800 flex flex-row">
            <div class="flex flex-row items-center justify-center mr-2">
                <el-icon :size="25" color="dodgerblue">
                    <i-ant-design-question-outlined />
                </el-icon>
            </div>
            <span class="title">
                {{ a.questionDescribe }}
            </span>
        </div>
        <div class="mt-2">
            <user-profile :user="a.answer.author" />
        </div>
        <div class="">
            <md-editor
                :editor-id="'answer__' + index"
                preview-theme="cyanosis"
                :show-code-row-number="true"
                v-model="a.answer.content"
                :theme="currentTheme"
                :preview-only="true"
            />
        </div>
        <div class="p-4 bg-gray-100 rounded-md dark:bg-neutral-800 dark:text-dark">
            Add in {{ formatTime(a.executeTime) }} · {{ a.executeTime }}
        </div>
    </div>
</template>
