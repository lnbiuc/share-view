<script setup lang="ts">
import {useDialogControlStore, useThemeStore} from '../../pinia';
import {uploadFile} from '../../axios/api/fileApi';
import {
	ElMessage,
	ElNotification,
	UploadFile,
	UploadProps,
	UploadRequestOptions,
} from 'element-plus';
import {sendPost} from '../../axios/api/postApi';
import {ref} from 'vue';
import {CategoryEntity, getCategoryList} from '../../axios/api/categoryApi';

const dialogControlStore = useDialogControlStore();

const categoryList = ref<CategoryEntity[]>();
const getCategory = async () => {
	getCategoryList(1, 100).then((res) => {
		categoryList.value = res.data.data.data;
	});
};
getCategory();
const handlePublish = () => {
	data.value.imgList = [];
	imageMap.value.forEach((value, key, map) => {
		data.value.imgList.push(value);
	});
	if (data.value.categoryId != null && data.value.content.match('[\u4e00-\u9fa5_a-zA-Z0-9_]{2,10}')) {
		sendPost(data.value).then((res) => {
			if (res.data.code == 200) {
				dialogControlStore.sendPostForm.status = false;
				ElMessage.success('SUCCESS');
			} else {
				ElMessage.error(res.data.message);
			}
		});
	} else {
		ElMessage.warning('check your input params');
	}
};

const data = ref<{ imgList: number[]; content: string; categoryId: number | undefined }>({
	imgList: [],
	content: '',
	categoryId: undefined,
});

const imageMap = ref<Map<number | undefined, number>>(new Map());

const uploadImg = (param: UploadRequestOptions) => {
	return uploadFile(param.file).then((res) => {
		if (res.data.code == 200) {
			// @ts-ignore
			imageMap.value.set(param.file.uid, res.data.data.fileId);
			ElMessage.success('SUCCESS');
		} else {
			ElMessage.error(res.data.message)
		}
	});
};

const images = ref([]);

const removeImage = (uploadFile: UploadFile) => {
	imageMap.value.delete(uploadFile.raw?.uid);
};

const uploadError = (error: Error) => {
	ElNotification({
		title: 'Error',
		message: error.message,
		type: 'error',
		duration: 0,
	});
};

const maxImageCount = () => {
	ElNotification({
		title: 'Warning',
		message: 'Add a maximum of 9 images',
		type: 'warning',
		duration: 0,
	});
};

const dialogImageUrl = ref('');
const dialogVisible = ref(false);

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
	dialogImageUrl.value = uploadFile.url!;
	dialogVisible.value = true;
};

const themeStore = useThemeStore();
</script>

<template>
	<el-dialog
		v-model="dialogControlStore.sendPostForm.status"
		:close-on-press-escape="false"
		:show-close="false"
		:draggable="true"
	>
		<template #header="{ close, titleId, titleClass }">
			<div class="flex flex-row justify-between px-6">
				<h4 :id="titleId" :class="titleClass">
					<el-icon class="el-icon--left" size="20px">
						<i-ep-edit-pen/>
					</el-icon>
					<span class="text-xl"> Send Post </span>
				</h4>
				<el-button type="danger" @click="close" plain>
					<el-icon class="el-icon--left">
						<i-ep-circle-close-filled/>
					</el-icon>
					Close
				</el-button>
			</div>
		</template>
		<template #footer>
			<div class="flex flex-row justify-end mr-4 px-6">
				<el-button type="primary" @click="handlePublish" plain :dark="themeStore.isDark" color="#626aef">
					<el-icon class="el-icon--left">
						<i-ep-circle-check/>
					</el-icon>
					Publish
				</el-button>
			</div>
		</template>
		<div class="flex flex-col justify-start mb-4">
			<el-form label-position="right" status-icon label-width="auto">
				<el-form-item label="Content">
					<el-input type="textarea" maxlength="144" show-word-limit autofocus v-model="data.content"/>
				</el-form-item>
				<el-form-item label="Category" prop="categoryId">
					<el-select v-model="data.categoryId" clearable placeholder="Select Category" style="width: 100%">
						<el-option v-for="c in categoryList" :key="c.id" :label="c.name" :value="c.id"/>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<el-upload
			v-model:file-list="images"
			:http-request="uploadImg"
			:with-credentials="true"
			list-type="picture-card"
			:on-remove="removeImage"
			:on-error="uploadError"
			:on-exceed="maxImageCount"
			:limit="9"
			:drag="true"
			:on-preview="handlePictureCardPreview"
			:multiple="true"
		>
			<template #default>
				<el-icon class="w-full">
					<i-ep-plus/>
				</el-icon>
			</template>
		</el-upload>
		<el-dialog v-model="dialogVisible">
			<img class="w-full" :src="dialogImageUrl" alt="Preview Image"/>
		</el-dialog>
	</el-dialog>
</template>
