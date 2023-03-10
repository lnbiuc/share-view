<script setup lang="ts">
import { useDialogControlStore, useThemeStore } from '../../pinia';
import { CategoryEntity, getCategoryList } from '../../axios/api/categoryApi';
import { publishArticle, TagEntity } from '../../axios/api/articleApi';
import { getAllTags, publishTag } from '../../axios/api/tagApi';
import { ElMessage, FormInstance } from 'element-plus';
import { ref } from 'vue';
import { handleUploadImage } from '../../utils';
import MdEditor from 'md-editor-v3';
import { storeToRefs } from 'pinia';
const dialogControlStore = useDialogControlStore();

const text = ref<string>('');
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
            }
        });
    } else {
        ElMessage.warning('tag name format error');
    }
};

const articleForm = ref<{
    title: string;
    introduction: string;
    categoryId: number | undefined;
    content: string;
    tagIds: number[];
}>({
    title: '',
    introduction: '',
    categoryId: undefined,
    content: '',
    tagIds: [],
});
const validateTitle = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('title is required'));
    } else if (value.length > 64) {
        callback(new Error('title too long'));
    }
    callback();
};

const validateIntroduction = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('title is required'));
    } else if (value.length > 128) {
        callback(new Error('title too long'));
    }
    callback();
};
const validateCategory = (rule: any, value: any, callback: any) => {
    if (value < 3000) {
        callback(new Error('category is required'));
    }
    callback();
};

const validateTags = (rule: any, value: number[], callback: any) => {
    if (value.length > 5 || value.length < 1) {
        callback(new Error('require 1 - 5 tags'));
    }
    callback();
};
const articleFormRules = reactive({
    title: [{ required: true, validator: validateTitle, trigger: 'blur' }],
    introduction: [{ required: true, validator: validateIntroduction, trigger: 'blur' }],
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
            publishArticle(articleForm.value).then((res) => {
                if (res.data.code == 200) {
                    dialogControlStore.publishArticleForm.status = false;
                    ElMessage.success('SUCCESS');
                } else {
                    ElMessage.error(res.data.message);
                }
            });
        }
    });
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
        v-model="dialogControlStore.publishArticleForm.status"
        :close-on-press-escape="false"
        :fullscreen="true"
        :show-close="false"
        :draggable="true"
    >
        <template #header="{ close, titleId, titleClass }">
            <div class="flex flex-row justify-between px-6">
                <h4 :id="titleId" :class="titleClass">
                    <el-icon class="el-icon--left">
                        <i-ep-edit-pen />
                    </el-icon>
                    Publish Article
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
        <div class="flex flex-col">
            <div>
                <el-form
                    ref="ruleFormRef"
                    :rules="articleFormRules"
                    :model="articleForm"
                    label-position="right"
                    status-icon
                    label-width="auto"
                >
                    <el-form-item label="Title" prop="title">
                        <el-input v-model="articleForm.title" type="text" />
                    </el-form-item>
                    <el-form-item label="Introduction" prop="introduction">
                        <el-input v-model="articleForm.introduction" type="textarea" />
                    </el-form-item>
                    <el-form-item label="Category" prop="categoryId">
                        <el-select
                            v-model="articleForm.categoryId"
                            clearable
                            placeholder="Select Category"
                            style="width: 100%"
                        >
                            <el-option v-for="c in categoryList" :key="c.id" :label="c.name" :value="c.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Tag" prop="tagIds">
                        <el-select v-model="articleForm.tagIds" multiple placeholder="Select Tags" style="width: 100%">
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
            </div>
            <md-editor
                v-model="articleForm.content"
                :theme="currentTheme"
                :tab-width="4"
                :show-code-row-number="true"
                :auto-focus="true"
                style="height: 50vh"
                @on-upload-img="handleUploadImage"
            />
        </div>
    </el-dialog>
</template>
