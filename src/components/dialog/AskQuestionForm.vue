<script setup lang="ts">
import { useCategoryAndTagsStore, useDialogControlStore, useThemeStore } from '../../pinia';
import { Ref, ref } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { CategoryEntity } from '../../axios/api/categoryApi';
import { TagEntity } from '../../axios/api/articleApi';
import { publishTag } from '../../axios/api/tagApi';
import { handleUploadImage } from '../../utils';
import { publishQuestion } from '../../axios/api/questionApi';
import { storeToRefs } from 'pinia';
import MdEditor from 'md-editor-v3';

const dialogControlStore = useDialogControlStore();
const questionForm: Ref<{ title: string; categoryId: number | undefined; content: string; tagIds: number[] }> = ref({
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
const categoryAndTagsStore = useCategoryAndTagsStore();
const refCategoryAndTagsStore = storeToRefs(categoryAndTagsStore);
const categoryList: Ref<CategoryEntity[]> = ref(refCategoryAndTagsStore.category);
const tagList: Ref<TagEntity[]> = ref(refCategoryAndTagsStore.tags);
const tag = ref<string>('');
const createTag = () => {
    if (tag.value.match('[\u4e00-\u9fa5_a-zA-Z0-9_]{2,10}')) {
        publishTag(tag.value).then((res) => {
            if (res.data.code == 200) {
                categoryAndTagsStore.refreshTags();
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
const questionFormRules: FormRules = reactive<FormRules>({
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

const themeStore = useThemeStore();
const refThemeStore = storeToRefs(themeStore);
const currentTheme = ref<'dark' | 'light'>(themeStore.isDark ? 'dark' : 'light');
watch(refThemeStore.isDark, (val) => {
    currentTheme.value = val ? 'dark' : 'light';
});
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
            <div class="flex flex-row justify-between">
                <h4 :id="titleId" :class="titleClass">
                    <el-icon class="el-icon--left">
                        <i-ep-edit-pen />
                    </el-icon>
                    Ask Question
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
                <el-button
                    type="primary"
                    plain
                    @click="handlePublish(ruleFormRef)"
                    color="#626aef"
                    :dark="themeStore.isDark"
                >
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
                    <el-button plain bg color="#626aef" :dark="themeStore.isDark" class="ml-3" @click="createTag"
                        >Create
                    </el-button>
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
        <md-editor
            v-model="questionForm.content"
            :theme="currentTheme"
            :tab-width="4"
            :show-code-row-number="true"
            :auto-focus="true"
            style="height: 50vh"
            @on-upload-img="handleUploadImage"
        />
    </el-dialog>
</template>
