<script setup lang="ts">
import {useCategoryAndTagsStore, useDialogControlStore, useThemeStore} from "../../pinia";
import {publishVideo, publishVideosParams} from "../../axios/api/videosApi";
import {ref, Ref} from "vue";
import {ElMessage, FormInstance, FormRules, UploadRequestOptions} from "element-plus";
import {storeToRefs} from "pinia";
import {CategoryEntity} from "../../axios/api/categoryApi";
import {TagEntity} from "../../axios/api/articleApi";
import {publishTag} from "../../axios/api/tagApi";
import {validateCategory, validateIntroduction, validateTags, validateTitle} from "../../common/vaildator";
import {uploadImage, uploadVideo} from "../../axios/api/fileApi";
import {uploadError, uploadSuccess} from "../../common/message";

const dialogControlStore = useDialogControlStore();
const params: Ref<publishVideosParams> = ref({
    videoId: '',
    url: '',
    preview: '',
    title: '',
    introduction: '',
    categoryId: undefined,
    tagIds: [],
})

const handlePublish = (formEl: FormInstance | undefined) => {
    if (!formEl) {
        return;
    }
    formEl.validate((valid) => {
        if (!valid) {
            return false;
        } else {
            publishVideo(params.value).then(res => {
                ElMessage.success('SUCCESS');
                dialogControlStore.uploadVideoForm.status = false;
                params.value.videoId = ''
                params.value.url = ''
                params.value.preview = ''
                params.value.title = ''
                params.value.introduction = ''
                params.value.categoryId = undefined
                params.value.tagIds = []
            })
        }
    });
}

const categoryAndTagsStore = useCategoryAndTagsStore();
const refCategoryAndTagsStore = storeToRefs(categoryAndTagsStore);
const categoryList: Ref<CategoryEntity[]> = ref(refCategoryAndTagsStore.category);
const tagList: Ref<TagEntity[]> = ref(refCategoryAndTagsStore.tags);

const themeStore = useThemeStore();
const refThemeStore = storeToRefs(themeStore);
const currentTheme = ref<'dark' | 'light'>(themeStore.isDark ? 'dark' : 'light');
watch(refThemeStore.isDark, (val) => {
    currentTheme.value = val ? 'dark' : 'light';
});
const tag = ref<string>('');
const createTag = () => {
    if (tag.value.match('[\u4e00-\u9fa5_a-zA-Z0-9_]{2,10}')) {
        publishTag(tag.value).then((res) => {
            if (res.data.code == 200) {
                categoryAndTagsStore.refreshTags();
                ElMessage.success('SUCCESS');
            }
        });
    } else {
        ElMessage.warning('tag name format error');
    }
};

const articleFormRules: FormRules = reactive({
    title: [{required: true, validator: validateTitle, trigger: 'blur'}],
    introduction: [{required: true, validator: validateIntroduction, trigger: 'blur'}],
    categoryId: [{required: true, validator: validateCategory, trigger: 'blur'}],
    tagIds: [{required: true, validator: validateTags, trigger: 'blur'}],
    preview: [{required: true, message: 'Please upload preview', trigger: 'blur'}],
    url: [{required: true, message: 'Please upload video', trigger: 'blur'}],
});

const ruleFormRef = ref<FormInstance>();


const handleUploadImg = (param: UploadRequestOptions) => {
    return uploadImage(param.file).then((res) => {
        if (res.data.code == 200) {
            params.value.preview = res.data.data.fileUrl
            uploadSuccess(res.data.message)
        } else {
            ElMessage.error(res.data.message);
        }
    });
};

const showVideo = ref<boolean>(false);

const handleUploadVideo = (param: UploadRequestOptions) => {
    return uploadVideo(param.file).then((res) => {
        if (res.data.code == 200) {
            params.value.url = res.data.data.fileUrl
            params.value.videoId = res.data.data.fileId
            showVideo.value = true;
            uploadSuccess(res.data.message)
        } else {
            ElMessage.error(res.data.message);
        }
    });
};
const {proxy}: any = getCurrentInstance();

const handlePreview = () => {
    proxy.$viewerApi({
        images: [params.value.preview],
    });
}

const removeVideo = () => {
    params.value.url = '';
    showVideo.value = false;
}

</script>

<template>
    <el-dialog
            v-model="dialogControlStore.uploadVideoForm.status"
            :close-on-press-escape="false"
            :fullscreen="true"
            :show-close="false"
            :draggable="true"
    >
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
                <el-button type="primary" @click="handlePublish(ruleFormRef)">
                    <el-icon class="el-icon--left">
                        <i-ep-circle-check/>
                    </el-icon>
                    Publish
                </el-button>
            </div>
        </template>
        <div class="flex flex-col">
            <el-form
                    ref="ruleFormRef"
                    :rules="articleFormRules"
                    :model="params"
                    label-position="right"
                    status-icon
                    label-width="auto"
            >
                <el-form-item label="Title" prop="title">
                    <el-input v-model="params.title" type="text" maxlength="64" show-word-limit/>
                </el-form-item>
                <el-form-item label="Introduction" prop="introduction">
                    <el-input v-model="params.introduction" type="textarea" maxlength="144" show-word-limit/>
                </el-form-item>
                <el-form-item label="Category" prop="categoryId">
                    <el-select
                            v-model="params.categoryId"
                            clearable
                            placeholder="Select Category"
                            style="width: 100%"
                    >
                        <el-option v-for="c in categoryList" :key="c.id" :label="c.name" :value="c.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="Tag" prop="tagIds">
                    <el-select v-model="params.tagIds" multiple placeholder="Select Tags" style="width: 100%">
                        <el-option v-for="t in tagList" :key="t.tagId" :label="t.tagName" :value="t.tagId"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="Create New Tag">
                    <div class="flex flex-row">
                        <el-input v-model="tag" class="flex-grow"/>
                        <el-button
                                plain
                                bg
                                color="#626aef"
                                :dark="themeStore.isDark"
                                class="ml-3"
                                @click="createTag"
                        >Create
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item label="Image Url" prop="preview">
                    <el-input disabled v-model="params.preview"/>
                </el-form-item>
                <el-form-item label="Preview Image" class="mt-6">
                    <div class="flex flex-row w-full">
                        <el-upload
                                :http-request="handleUploadImg"
                                :on-error="uploadError"
                                :on-preview="handlePreview"
                                :limit="1"
                                drag
                                list-type="picture-card"
                        >
                            <div class="el-upload__text">
                                Upload Preview Image <em>click to upload</em>
                            </div>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item label="Video Url" prop="url">
                    <el-input disabled v-model="params.url"/>
                </el-form-item>
                <el-form-item label="Video">
                    <div class="flex flex-row w-full">
                        <el-upload
                                :http-request="handleUploadVideo"
                                :on-error="uploadError"
                                :limit="1"
                                drag
                                list-type="text"
                                :on-remove="removeVideo"
                        >
                            <div class="el-upload__text">
                                Upload Videos <em>click to upload</em>
                            </div>
                        </el-upload>
                        <div v-if="showVideo" class="m-auto text-center">
                            <video-player
                                    :src="params.url"
                                    :poster="params.preview"
                                    :controls="true"
                                    :loop="true"
                                    :volume="0.5"
                                    :prefer-full-window="true"
                            />
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <div>
            </div>
        </div>
    </el-dialog>
</template>
<style scoped>
:deep(.el-upload) {
    height: 148px;
    width: 200px;
}

:deep(.el-upload .el-upload-dragger) {
    height: 148px;
    width: 200px;
}
</style>