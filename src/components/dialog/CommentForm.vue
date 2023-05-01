<script setup lang="ts">
import { useDialogControlStore, useReloadCommentStore, useThemeStore } from '../../pinia';
import { publishComments } from '../../axios/api/commentsApi';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';

const dialogStore = useDialogControlStore();
const refDialogStore = storeToRefs(dialogStore);
const params = storeToRefs(dialogStore);
const handlePublish = () => {
    if (params.commentForm.value.data.level == 0) {
        if (params.commentForm.value.data.articleId !== '' && params.commentForm.value.data.content !== '') {
            publishComments(params.commentForm.value.data).then((res) => {
                if (res.data.code == 200) {
                    dialogStore.commentForm.status = false;
                    const reloadStore = useReloadCommentStore();
                    reloadStore.reload = params.commentForm.value.data.articleId;
                    reloadStore.increase();
                    ElMessage.success('SUCCESS');
                } else {
                    ElMessage.error(res.data.message);
                }
            });
        } else {
            ElMessage.warning('miss params to article');
        }
    } else {
        if (params.commentForm.value.data.toCommentId !== 0 && params.commentForm.value.data.content !== '') {
            publishComments(params.commentForm.value.data).then((res) => {
                if (res.data.code == 200) {
                    dialogStore.commentForm.status = false;
                    const reloadStore = useReloadCommentStore();
                    reloadStore.reload = params.commentForm.value.data.articleId;
                    reloadStore.increase();
                    ElMessage.success('SUCCESS');
                } else {
                    ElMessage.error(res.data.message);
                }
            });
        } else {
            ElMessage.warning('miss params to comment');
        }
    }
};

const themeStore = useThemeStore();

const handleBeforeClose = () => {
    params.commentForm.value.data.content = '';
};
</script>

<template>
    <el-dialog
        class="p-6"
        v-model="dialogStore.commentForm.status"
        width="30%"
        title="Create Comment"
        :lock-scroll="false"
        :modal="false"
        :draggable="true"
        :show-close="false"
        :before-close="handleBeforeClose"
    >
        <template #header="{ close, titleId, titleClass }">
            <div class="flex flex-row justify-between">
                <div :id="titleId" :class="titleClass">
                    <span class="text-blue-500">
                        <el-icon class="el-icon--left">
                            <i-ep-edit-pen />
                        </el-icon>
                        Comment To
                    </span>
                    <br />
                    <div class="mt-4">
                        <span class="text-base overflow-auto break-all">
                            {{ refDialogStore.commentForm.value.displayInfo }}
                        </span>
                    </div>
                </div>
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
                <el-button type="primary" @click="handlePublish" color="#626aef" plain :dark="themeStore.isDark">
                    <el-icon class="el-icon--left">
                        <i-ep-circle-check />
                    </el-icon>
                    Comment
                </el-button>
            </div>
        </template>
        <el-input
            show-word-limit
            maxlength="144"
            :autofocus="true"
            :rows="5"
            style="font-size: 1.25rem"
            v-model="refDialogStore.commentForm.value.data.content"
            type="textarea"
        />
    </el-dialog>
</template>
