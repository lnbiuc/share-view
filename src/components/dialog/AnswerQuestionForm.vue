<script setup lang="ts">
import { useDialogControlStore } from '../../pinia';
import { handleUploadImage } from '../../utils';
import { publishAnswer } from '../../axios/api/questionApi';
import { ElMessage } from 'element-plus';

const props = defineProps({
    question: {
        type: String,
        default: ''
    },
    questionId: {
        type: String,
        default: ''
    },

})

const answer = ref<{content: string, toId: string}>({
    content: '',
    toId: props.questionId
})

const dialogControlStore = useDialogControlStore()
const handlePublish = () => {
    if (answer.value.toId !== '' && answer.value.content !== '') {
        publishAnswer(answer.value.toId, answer.value.content).then(res => {
            if (res.data.code == 200) {
                dialogControlStore.answerQuestionForm.status = false
                ElMessage.success('SUCCESS');
            } else {
                ElMessage.error(res.data.message)
            }
        })
    } else {
        ElMessage.warning('content required')
    }
}
</script>

<template>
    <el-dialog
        v-model="dialogControlStore.answerQuestionForm.status"
        :close-on-press-escape="false"
        :fullscreen="true"
        :show-close="false"
        :draggable="true">
        <template #header="{ close, titleId, titleClass }">
            <div class="flex flex-row justify-between px-6">
                <h4 :id="titleId" :class="titleClass">
                    <el-icon class="el-icon--left" size="20px">
                        <i-ep-edit-pen/>
                    </el-icon>
                    <span class="text-xl">
                        Question: {{ question }}
                    </span>
                    <span class="text-sm text-gray-500">
                         @{{ questionId }}
                    </span>
                </h4>
                <el-button type="danger" @click="close">
                    <el-icon class="el-icon--left">
                        <i-ep-circle-close-filled/>
                    </el-icon>
                    Close
                </el-button>
            </div>
        </template>
        <template #footer>
            <div class="flex flex-row justify-end mr-4 px-6">
                <el-button type="primary" @click="handlePublish">
                    <el-icon class="el-icon--left">
                        <i-ep-circle-check/>
                    </el-icon>
                    Publish
                </el-button>
            </div>
        </template>
        <v-md-editor
            v-model="answer.content"
            :tab-size="4"
            :disabled-menus="[]"
            :autofocus="true"
            :default-show-toc="true"
            @upload-image="handleUploadImage"
            height="80vh">
        </v-md-editor>
    </el-dialog>
</template>
