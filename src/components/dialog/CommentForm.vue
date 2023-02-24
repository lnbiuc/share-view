<script setup lang="ts">
import { useDialogControlStore, useReloadCommentStore } from '../../pinia';
import { publishComments } from '../../axios/api/commentsApi';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';

const dialogStore = useDialogControlStore()
const refDialogStore = storeToRefs(dialogStore)
const params = storeToRefs(dialogStore)
const handlePublish = () => {
    console.log(params.commentForm.value)
    if (params.commentForm.value.data.level == 0) {
        if (params.commentForm.value.data.articleId !== '' && params.commentForm.value.data.content !== '') {
            publishComments(params.commentForm.value.data).then(res => {
                if (res.data.code == 200) {
                    dialogStore.commentForm.status = false
                    const reloadStore = useReloadCommentStore()
                    reloadStore.reload = params.commentForm.value.data.articleId
                    reloadStore.increase()
                    ElMessage.success('SUCCESS')
                } else {
                    ElMessage.error(res.data.message)
                }
            })
        } else {
            ElMessage.error('miss params to article')
        }
    } else {
        if (params.commentForm.value.data.toCommentId !== 0 && params.commentForm.value.data.content !== '') {
            publishComments(params.commentForm.value.data).then(res => {
                if (res.data.code == 200) {
                    dialogStore.commentForm.status = false
                    const reloadStore = useReloadCommentStore()
                    reloadStore.reload = params.commentForm.value.data.articleId
                    reloadStore.increase()
                    ElMessage.success('SUCCESS')
                } else {
                    ElMessage.error(res.data.message)
                }
            })
        } else {
            ElMessage.error('miss params to comment')
        }
    }
}

</script>

<template>
    <el-dialog class="p-6" v-model="dialogStore.commentForm.status" width="30%" title="Create Comment" :lock-scroll="false">
        <template #header="{ close, titleId, titleClass }">
            <div class="flex flex-row justify-between">
                <h4 :id="titleId" :class="titleClass">
                    <div class="flex flex-col">
                        <span>
                            <el-icon class="el-icon--left">
                                <i-ep-edit-pen/>
                            </el-icon>
                            Comment To
                        </span>
                        <span class="text-sm mt-6 overflow-auto break-all">
                            {{ refDialogStore.commentForm.value.displayInfo }}
                        </span>
                    </div>
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
            <div class="flex flex-row justify-end mr-4">
                <el-button type="primary" @click="handlePublish">
                    <el-icon class="el-icon--left">
                        <i-ep-circle-check/>
                    </el-icon>
                    Comment
                </el-button>
            </div>
        </template>
        <el-input show-word-limit maxlength="144" v-model="refDialogStore.commentForm.value.data.content" type="textarea"/>
    </el-dialog>
</template>
