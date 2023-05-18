<script setup lang="ts">
import { UserEntity } from '../../../axios/api/loginApi';
import { ref, Ref } from 'vue';
import { uploadSuccess } from '../../../common/message';
import { ElMessage, FormInstance, UploadRequestOptions } from 'element-plus';
import { uploadImage } from '../../../axios/api/fileApi';
import { Message, Phone, Picture, User } from '@element-plus/icons-vue';
import { UserProfileEntity } from '../../../axios/api/userApi';

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

const injectInfo = inject<Ref<UserProfileEntity>>('userInfo', params);

watch(injectInfo, () => {
    params.value = injectInfo!.value;
});

const uploadImg = (param: UploadRequestOptions) => {
    return uploadImage(param.file).then((res) => {
        if (res.data.code == 200) {
            params.value.avatar = res.data.data.fileId;
            uploadSuccess(res.data.message);
        } else {
            ElMessage.error(res.data.message);
        }
    });
};

const enableEdit = ref<boolean>(true);

const handleSave = () => {
    enableEdit.value = !enableEdit.value;
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
            <el-form :model="params" label-width="120px">
                <el-form-item label="User Name" size="large">
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
            <el-button v-if="!enableEdit" @click="handleSave" type="primary">
                <el-icon class="mr-2" :size="20">
                    <i-ep-circle-check />
                </el-icon>
                Sava
            </el-button>
        </div>
    </div>
</template>
