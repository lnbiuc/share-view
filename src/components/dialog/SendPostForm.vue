<script setup lang="ts">
import { useDialogControlStore } from '../../pinia';
import { uploadFile } from '../../axios/api/fileApi';
import { ElMessage, UploadFile } from 'element-plus';

const dialogControlStore = useDialogControlStore()
const handlePublish = () => {
    imageMap.forEach((value, key, map) => {
        data.value.imgList = []
        data.value.imgList.push(value)
    })
}

const data = ref<{imgList: number[], content: string}>({
    imgList: [],
    content: ''
})

const imageMap = new Map()



const uploadImg = (param:any) => {
    uploadFile(param.file).then(res => {
        imageMap.set(param.file.uid, res.data.data.imgId)
        ElMessage.success('SUCCESS')
    })
}

const images = ref([])

const uploadSuccess = (res:any, uploadFile: UploadFile) => {
    data.value.imgList.push(res.data.data.imgId)
}

const removeImage = (uploadFile: UploadFile) => {
    imageMap.delete(uploadFile.raw?.uid)
};

const uploadError = () => {

}
</script>

<template>
    <el-dialog
        v-model="dialogControlStore.sendPostForm.status"
        :close-on-press-escape="false"
        :show-close="false"
        :draggable="true">
        <template #header="{ close, titleId, titleClass }">
            <div class="flex flex-row justify-between px-6">
                <h4 :id="titleId" :class="titleClass">
                    <el-icon class="el-icon--left" size="20px">
                        <i-ep-edit-pen/>
                    </el-icon>
                    <span class="text-xl">
                        Send Post
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
        <div class="flex flex-col justify-start mb-4">
            <span class="mr-3 text-left text-xl">Content:</span>
            <el-input type="textarea" v-model="data.content"/>
        </div>
        {{ data }}
        <el-upload
            v-model:file-list="images"
            :http-request="uploadImg"
            name="img"
            :with-credentials="true"
            list-type="picture-card"
            :on-success="uploadSuccess"
            :on-remove="removeImage"
            :on-error="uploadError"
            :drag="true"
        >
            <el-icon><Plus /></el-icon>
        </el-upload>
    </el-dialog>
</template>

