<script setup lang="ts">
import { useDialogControlStore, useThemeStore } from '../../pinia';
import { handleUploadImage } from '../../utils';
import { publishAnswer } from '../../axios/api/questionApi';
import { ElMessage } from 'element-plus';
import MdEditor from 'md-editor-v3';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const props = defineProps({
    question: {
        type: String,
        default: '',
    },
    questionId: {
        type: String,
        default: '',
    },
});

const answer = ref<{ content: string; toId: string }>({
    content: '',
    toId: props.questionId,
});

const dialogControlStore = useDialogControlStore();
const handlePublish = () => {
    if (answer.value.toId !== '' && answer.value.content !== '') {
        publishAnswer(answer.value.toId, answer.value.content).then((res) => {
            if (res.data.code == 200) {
                dialogControlStore.answerQuestionForm.status = false;
                ElMessage.success('SUCCESS');
            } else {
                ElMessage.error(res.data.message);
            }
        });
    } else {
        ElMessage.warning('content required');
    }
};

const themeStore = useThemeStore();
const refThemeStore = storeToRefs(themeStore);
const currentTheme = ref<'dark' | 'light'>(themeStore.isDark ? 'dark' : 'light');
watch(refThemeStore.isDark, (val) => {
    currentTheme.value = val ? 'dark' : 'light';
});
</script>

<template>
    <el-dialog
        v-model="dialogControlStore.answerQuestionForm.status"
        :close-on-press-escape="false"
        :fullscreen="true"
        :show-close="false"
        :draggable="true"
    >
        <template #header="{ close, titleId, titleClass }">
            <div class="flex flex-row justify-between px-6">
                <h4 :id="titleId" :class="titleClass">
                    <el-icon class="el-icon--left" size="20px">
                        <i-ep-edit-pen />
                    </el-icon>
                    <span class="text-xl"> Question: {{ question }} </span>
                    <span class="text-sm text-gray-500"> @{{ questionId }} </span>
                </h4>
                <el-button type="danger" @click="close" plain>
                    <el-icon class="el-icon--left">
                        <i-ep-circle-close-filled />
                    </el-icon>
                    Close
                </el-button>
            </div>
        </template>
        <template #footer>
            <div class="flex flex-row justify-end mr-4 px-6">
                <el-button @click="handlePublish" plain color="#626aef" :dark="themeStore.isDark">
                    <el-icon class="el-icon--left">
                        <i-ep-circle-check />
                    </el-icon>
                    Publish
                </el-button>
            </div>
        </template>
        <md-editor
            v-model="answer.content"
            :theme="currentTheme"
            :tab-width="4"
            :show-code-row-number="true"
            :auto-focus="true"
            style="height: 80vh"
            @on-upload-img="handleUploadImage"
        />
    </el-dialog>
</template>
