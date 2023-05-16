<script setup lang="ts">
import { useCategoryAndTagsStore, useDialogControlStore, useThemeStore, useUpdateArticleStore } from '../../pinia';
import { CategoryEntity } from '../../axios/api/categoryApi';
import { ArticleUpdateParams, publishArticle, TagEntity, updateArticle } from '../../axios/api/articleApi';
import { publishTag } from '../../axios/api/tagApi';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { PropType, Ref, ref } from 'vue';
import { handleUploadImage } from '../../utils';
import MdEditor from 'md-editor-v3';
import { storeToRefs } from 'pinia';
import { validateCategory, validateIntroduction, validateTags, validateTitle } from '../../common/vaildator';

const dialogControlStore = useDialogControlStore();

const text = ref<string>('');
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

const articleFormRules: FormRules = reactive({
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
            if (updateArticleStore.enable) {
                updateArticleStore.params.title = articleForm.value.title;
                updateArticleStore.params.introduction = articleForm.value.introduction;
                updateArticleStore.params.categoryId = articleForm.value.categoryId
                    ? articleForm.value.categoryId
                    : 1001;
                updateArticleStore.params.content = articleForm.value.content;
                updateArticleStore.params.tagIds = articleForm.value.tagIds;
                updateArticle(updateArticleStore.params).then((res) => {
                    if (res.data.code == 200) {
                        dialogControlStore.publishArticleForm.status = false;
                        updateArticleStore.count++;
                        ElMessage.success('SUCCESS');
                    } else {
                        ElMessage.error(res.data.message);
                    }
                });
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
        }
    });
};

const themeStore = useThemeStore();
const refThemeStore = storeToRefs(themeStore);
const currentTheme = ref<'dark' | 'light'>(themeStore.isDark ? 'dark' : 'light');
watch(refThemeStore.isDark, (val) => {
    currentTheme.value = val ? 'dark' : 'light';
});
// update

const menuInfo = ref<{ title: 'Publish Article' | 'Update Article'; confirm: 'Publish' | 'Update' }>({
    title: 'Publish Article',
    confirm: 'Publish',
});
const updateArticleStore = useUpdateArticleStore();
const refUpdateArticleStore = storeToRefs(updateArticleStore);

watch(refUpdateArticleStore.enable, (val) => {
    if (val) {
        menuInfo.value.title = 'Update Article';
        menuInfo.value.confirm = 'Update';
        articleForm.value = updateArticleStore.params;
    } else {
        menuInfo.value.title = 'Publish Article';
        menuInfo.value.confirm = 'Publish';
    }
});

const dialogClosed = () => {
    updateArticleStore.enable = false;
    articleForm.value = {
        title: '',
        introduction: '',
        categoryId: undefined,
        content: '',
        tagIds: [],
    };
    menuInfo.value.title = 'Publish Article';
    menuInfo.value.confirm = 'Publish';
};
</script>

<template>
    <el-dialog
        v-model="dialogControlStore.publishArticleForm.status"
        :close-on-press-escape="false"
        :fullscreen="true"
        :show-close="false"
        :draggable="true"
        @closed="dialogClosed"
    >
        <template #header="{ close, titleId, titleClass }">
            <div class="flex flex-row justify-between">
                <h4 :id="titleId" :class="titleClass">
                    <el-icon class="el-icon--left">
                        <i-ep-edit-pen />
                    </el-icon>
                    {{ menuInfo.title }}
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
                    @click="handlePublish(ruleFormRef)"
                    plain
                    color="#626aef"
                    :dark="themeStore.isDark"
                >
                    <el-icon class="el-icon--left">
                        <i-ep-circle-check />
                    </el-icon>
                    {{ menuInfo.confirm }}
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
                        <el-input v-model="articleForm.title" type="text" maxlength="64" show-word-limit />
                    </el-form-item>
                    <el-form-item label="Introduction" prop="introduction">
                        <el-input v-model="articleForm.introduction" type="textarea" maxlength="144" show-word-limit />
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
