<script setup lang="ts">
import { ref, Ref } from 'vue';
import { uploadSuccess } from '../../../common/message';
import { ElMessage, FormInstance, FormRules, UploadRequestOptions } from 'element-plus';
import { uploadImage } from '../../../axios/api/fileApi';
import { Message, Phone, Picture, User } from '@element-plus/icons-vue';
import {
    getUserProfile,
    updateUserProfile,
    UpdateUserProfileEntity,
    UserProfileEntity,
} from '../../../axios/api/userApi';
import { useUserSettingStore } from '../../../pinia';
import { storeToRefs } from 'pinia';
import { updateUserInfo } from '../../../utils';

const params: Ref<UserProfileEntity> = ref({
    userId: 'new',
    username: '',
    phone: '',
    mail: '',
    signature: '',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    level: 0,
    isBlock: false,
    permissionLevel: 0,
    registerTime: '',
    isMailNotice: false,
    isPhoneNotice: false,
    theme: 'auto',
    lastLogin: '',
    ipAddr: '',
});

const userSettingStore = useUserSettingStore();
const refUserSettingStore = storeToRefs(userSettingStore);
params.value = userSettingStore.params;
watchEffect(
    () => {
        params.value = refUserSettingStore.params.value;
    },
    {
        flush: 'sync',
    }
);

const uploadImg = (param: UploadRequestOptions) => {
    return uploadImage(param.file).then((res) => {
        if (res.data.code == 200) {
            params.value.avatar = res.data.data.fileUrl;
            uploadSuccess(res.data.message);
        } else {
            ElMessage.error(res.data.message);
        }
    });
};

const enableEdit = ref<boolean>(true);

const updateParams: Ref<UpdateUserProfileEntity> = ref({
    userId: '',
    username: '',
    signature: '',
    avatar: '',
    isMailNotice: false,
    isPhoneNotice: false,
    theme: '',
});

const handleSave = () => {
    updateParams.value.userId = params.value.userId;
    updateParams.value.username = params.value.username;
    updateParams.value.signature = params.value.signature;
    updateParams.value.avatar = params.value.avatar;
    updateParams.value.isMailNotice = params.value.isMailNotice;
    updateParams.value.isPhoneNotice = params.value.isPhoneNotice;
    updateParams.value.theme = params.value.theme;
    updateUserProfile(updateParams.value).then((res) => {
        if (res.data.code == 200) {
            ElMessage.success(res.data.message);
            const userSettingStore = useUserSettingStore();
            getUserProfile(params.value.userId).then((res) => {
                userSettingStore.params = res.data.data;
                enableEdit.value = !enableEdit.value;
                updateUserInfo(userSettingStore.params);
            });
        } else {
            ElMessage.error(res.data.message);
        }
    });
};

const validateUsername = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('username is required'));
    } else {
        if (value.match(/^(?!.*\s)[\w\u4E00-\u9FFF\u3040-\u30FF]{2,20}$/)) {
            callback();
        } else {
            callback(new Error('2-20 characters, including letters, numbers, underscores, and Chinese'));
        }
    }
};

const formRule: FormRules = reactive({
    username: [{ required: true, validator: validateUsername, trigger: 'blur' }],
});

const ruleFormRef = ref<FormInstance>();

const handleSubmitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (!valid) {
            return false;
        } else {
            handleSave();
        }
    });
};
</script>

<template>
    <div class="border-light dark:border-dark rounded-md mx-2 mt-2 p-4 dark:bg-dark">
        <div class="flex flex-row m-4 justify-center">
            <el-avatar :src="params.avatar" :size="150" class="shadow-md"></el-avatar>
            <div class="flex flex-col justify-end mb-4 ml-4">
                <span class="text-[50px] font-semibold title">{{ params.username }}</span>
                <span>@{{ params.userId }}</span>
            </div>
        </div>
        <div class="mt-8">
            <el-form :model="params" label-width="120px" ref="ruleFormRef" :rules="formRule">
                <el-form-item label="User Name" size="large" prop="username">
                    <el-input
                        :prefix-icon="User"
                        v-model="params.username"
                        :disabled="enableEdit"
                        maxlength="20"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="Phone" size="large">
                    <el-input
                        :prefix-icon="Phone"
                        v-model="params.phone"
                        :disabled="true"
                        maxlength="11"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="Email" size="large">
                    <el-input
                        :prefix-icon="Message"
                        v-model="params.mail"
                        :disabled="true"
                        maxlength="36"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="Signature" size="large">
                    <el-input
                        type="textarea"
                        v-model="params.signature"
                        :disabled="enableEdit"
                        maxlength="128"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="Avatar" size="large">
                    <div class="flex flex-row flex-grow items-start">
                        <el-input class="w-full" :prefix-icon="Picture" disabled v-model="params.avatar" />
                        <el-upload
                            v-model="params.avatar"
                            :http-request="uploadImg"
                            :with-credentials="true"
                            :limit="1"
                            :multiple="false"
                            :disabled="enableEdit"
                        >
                            <template #trigger>
                                <el-button :disabled="enableEdit" class="ml-2" type="primary">
                                    <el-icon class="mr-2" :size="20">
                                        <i-ep-upload />
                                    </el-icon>
                                    upload avatar
                                </el-button>
                            </template>
                        </el-upload>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="flex flex-row justify-center items-center mt-4">
            <el-button v-if="enableEdit" @click="enableEdit = !enableEdit" type="warning">
                <el-icon class="mr-2" :size="20">
                    <i-ep-edit />
                </el-icon>
                Edit Profile
            </el-button>
            <el-button v-if="!enableEdit" @click="handleSubmitForm(ruleFormRef)" type="primary">
                <el-icon class="mr-2" :size="20">
                    <i-ep-circle-check />
                </el-icon>
                Sava
            </el-button>
        </div>
    </div>
</template>
