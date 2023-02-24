<script setup lang="ts">
import { useDialogControlStore } from '../../pinia';
import { ref } from 'vue';
import { ElMessage, ElNotification, FormInstance } from 'element-plus';
import { CategoryEntity, getCategoryList } from '../../axios/api/categoryApi';
import { TagEntity } from '../../axios/api/articleApi';
import { getAllTags, publishTag } from '../../axios/api/tagApi';
import { handleUploadImage } from '../../utils';
import { publishQuestion } from '../../axios/api/questionApi';

const dialogControlStore = useDialogControlStore();
const questionForm = ref<{ title: string; categoryId: number | undefined; content: string; tagIds: number[] }>({
    title: '',
    categoryId: undefined,
    content: '',
    tagIds: [],
});
const contentLength = ref<number>(1000);
watch(questionForm.value, () => {
    contentLength.value = 1000 - questionForm.value.content.length;
    showAlert.value = contentLength.value < 0;
});
const showAlert = ref<boolean>(false);
const categoryList = ref<CategoryEntity[]>();
const tagList = ref<TagEntity[]>();
const getCategory = async () => {
    getCategoryList(1, 100).then((res) => {
        categoryList.value = res.data.data.data;
    });
};
const getTag = async () => {
    getAllTags().then((res) => {
        tagList.value = res.data.data;
    });
};
// init category and tags
getCategory();
getTag();
const tag = ref<string>('');
const createTag = () => {
    if (tag.value.match('[\u4e00-\u9fa5_a-zA-Z0-9_]{2,10}')) {
        publishTag(tag.value).then((res) => {
            if (res.data.code == 200) {
                getTag();
                ElMessage.success('SUCCESS');
            } else {
                ElMessage.error(res.data.message);
            }
        });
    } else {
        ElMessage.warning('tag name format error');
    }
};

const validateTitle = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('title is required'));
    } else if (value.length > 64) {
        callback(new Error('title too long'));
    } else {
        callback();
    }
};

const validateCategory = (rule: any, value: any, callback: any) => {
    if (value < 3000) {
        callback(new Error('category is required'));
    } else {
        callback();
    }
};

const validateTags = (rule: any, value: number[], callback: any) => {
    if (value.length > 5 || value.length < 1) {
        callback(new Error('require 1 - 5 tags'));
    } else {
        callback();
    }
};
const questionFormRules = reactive({
    title: [{ required: true, validator: validateTitle, trigger: 'blur' }],
    categoryId: [{ required: true, validator: validateCategory, trigger: 'blur' }],
    tagIds: [{ required: true, validator: validateTags, trigger: 'blur' }],
});

const ruleFormRef = ref<FormInstance>();
const handlePublish = (formEl: FormInstance | undefined) => {
    if (!formEl) {
        return;
    }
    formEl.validate((valid) => {
        if (!valid) {
            return false;
        } else {
            publishQuestion(questionForm.value).then((res) => {
                if (res.data.code == 200) {
                    ElMessage.success('SUCCESS');
                } else {
                    ElMessage.error(res.data.message);
                    dialogControlStore.askQuestionForm.status = false;
                }
            });
        }
    });
};
</script>

<template>
    <el-dialog
        v-model="dialogControlStore.askQuestionForm.status"
        :fullscreen="true"
        :show-close="false"
        :close-on-press-escape="false"
        :draggable="true"
    >
        <template #header="{ close, titleId, titleClass }">
            <div class="flex flex-row justify-between px-6">
                <h4 :id="titleId" :class="titleClass">
                    <el-icon class="el-icon--left">
                        <i-ep-edit-pen />
                    </el-icon>
                    Ask Question
                </h4>
                <el-button type="danger" @click="close">
                    <el-icon class="el-icon--left">
                        <i-ep-circle-close-filled />
                    </el-icon>
                    Close
                </el-button>
            </div>
        </template>
        <template #footer>
            <div class="flex flex-row justify-end mr-4 px-6">
                <el-button type="primary" @click="handlePublish(ruleFormRef)">
                    <el-icon class="el-icon--left">
                        <i-ep-circle-check />
                    </el-icon>
                    Publish
                </el-button>
            </div>
        </template>
        <el-form
            ref="ruleFormRef"
            :rules="questionFormRules"
            :model="questionForm"
            label-position="right"
            status-icon
            label-width="auto"
        >
            <el-form-item label="Question" prop="title">
                <el-input type="text" v-model="questionForm.title" clearable style="width: 100%" />
            </el-form-item>
            <el-form-item label="Category" prop="categoryId">
                <el-select
                    v-model="questionForm.categoryId"
                    clearable
                    placeholder="Select Category"
                    style="width: 100%"
                >
                    <el-option v-for="c in categoryList" :key="c.id" :label="c.name" :value="c.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="Tag" prop="tagIds">
                <el-select v-model="questionForm.tagIds" multiple placeholder="Select Tags" style="width: 100%">
                    <el-option v-for="t in tagList" :key="t.tagId" :label="t.tagName" :value="t.tagId" />
                </el-select>
            </el-form-item>
            <el-form-item label="Create New Tag">
                <div class="flex flex-row">
                    <el-input v-model="tag" class="flex-grow" />
                    <el-button class="ml-3" @click="createTag">Create</el-button>
                </div>
            </el-form-item>
        </el-form>
        <el-divider>
            <span
                >Enter your question description in this textarea
                <span class="text-blue-500">
                    {{ contentLength }}
                </span>
                characters limit
                <el-icon color="rgb(59 130 246)">
                    <i-ep-bottom />
                </el-icon>
            </span>
        </el-divider>
        <div v-if="showAlert" class="transition-all flex flex-row justify-center p-4 items-center">
            <el-icon color="orange" size="30px">
                <i-ep-warn-triangle-filled />
            </el-icon>
            <span class="ml-4">Out of maximum length</span>
        </div>
        <v-md-editor
            v-model="questionForm.content"
            :tab-size="4"
            :disabled-menus="[]"
            :autofocus="true"
            :default-show-toc="true"
            @upload-image="handleUploadImage"
            height="50vh"
        >
        </v-md-editor>
    </el-dialog>
</template>
