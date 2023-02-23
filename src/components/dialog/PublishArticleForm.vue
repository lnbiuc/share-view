<script setup lang="ts">
import { useDialogControlStore } from '../../pinia';
import { uploadFile } from '../../axios/api/fileApi';

const dialogControlStore = useDialogControlStore();
const handlePublish = () => {
    dialogControlStore.publishArticleForm.status = false
}
const text = ref<string>('')
const handleUploadImage = (event:any, insertImage:any, files:any) => {
    uploadFile(files).then(res => {
        insertImage({
            url: res.data.data,
            desc: 'image',
        })
    })
}
</script>

<template>
    <el-dialog
        class=""
        v-model="dialogControlStore.publishArticleForm.status"
        width="80%"
        :fullscreen="true"
        title="Publish Article"
        :show-close="false"
        :draggable="true">
        <template #header="{ close, titleId, titleClass }">
            <div class="flex flex-row justify-between px-6">
                <h4 :id="titleId" :class="titleClass">
                    <el-icon class="el-icon--left">
                        <i-ep-edit-pen/>
                    </el-icon>
                    Publish Article
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
            v-model="text"
            :tab-size="4"
            :disabled-menus="[]"
            :autofocus="true"
            :default-show-toc="true"
            @upload-image="handleUploadImage"
            height="80vh">
        </v-md-editor>
    </el-dialog>
</template>
