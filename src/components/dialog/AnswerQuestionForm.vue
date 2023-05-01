<script setup lang="ts">
import { useDialogControlStore, useThemeStore } from '../../pinia';
import { handleUploadImage } from '../../utils';
import { publishAnswer } from '../../axios/api/questionApi';
import { ElMessage } from 'element-plus';
import MdEditor from 'md-editor-v3';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const props = defineProps({
    questionTitle: {
        type: String,
        default: '',
    },
    questionId: {
        type: String,
        default: '',
    },
});

const answer = ref<{ content: string }>({
    content: '',
});

const dialogControlStore = useDialogControlStore();
const handlePublish = () => {
    if (props.questionId !== '' && answer.value.content !== '') {
        publishAnswer(props.questionId, answer.value.content).then((res) => {
            if (res.data.code == 200) {
                dialogControlStore.answerQuestionForm.status = false;
                answer.value.content = '';
                ElMessage.success('SUCCESS');
                emit('on-publish-success');
            } else {
                ElMessage.error(res.data.message);
            }
        });
    } else {
        ElMessage.warning('content required');
    }
};

const emit = defineEmits(['on-publish-success']);

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
        :lock-scroll="true"
    >
        <template #header="{ close, titleId, titleClass }">
            <div class="flex flex-row justify-between">
                <h4 :id="titleId" :class="titleClass">
                    <el-icon class="el-icon--left" size="20px">
                        <i-ep-edit-pen />
                    </el-icon>
                    <span class="text-xl"> Question: {{ questionTitle }} </span>
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
            <div class="flex flex-row justify-end">
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
