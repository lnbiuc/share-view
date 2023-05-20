<script setup lang="ts">
import { ref, Ref } from 'vue';
import {
    getUserProfile,
    updateUserProfile,
    UpdateUserProfileEntity,
    UserProfileEntity,
} from '../../../axios/api/userApi';
import { useThemeStore, useUserSettingStore } from '../../../pinia';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
import { switchTheme, updateUserInfo } from '../../../utils';

const params: Ref<UserProfileEntity> = ref({
    userId: 'new',
    username: '',
    phone: '',
    mail: '',
    signature: '',
    avatar: '',
    level: 0,
    isBlock: false,
    permissionLevel: 0,
    registerTime: '',
    isMailNotice: false,
    isPhoneNotice: false,
    theme: 'light',
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

const themeStore = useThemeStore();

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
                updateUserInfo(userSettingStore.params);
            });
        } else {
            ElMessage.error(res.data.message);
        }
    });
};

watchEffect(() => {
    if (params.value.theme === 'light') {
        switchTheme(false);
    } else if (params.value.theme === 'light') {
        switchTheme(true);
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            switchTheme(true);
        } else {
            switchTheme(false);
        }
    }
});
</script>

<template>
    <div class="border-light dark:border-dark rounded-md mx-2 mt-2 p-8 dark:bg-dark">
        <el-form v-model="params" label-position="right" status-icon label-width="auto">
            <el-form-item label="Theme" prop="theme">
                <el-select v-model="params.theme" placeholder="Theme">
                    <el-option label="auto" value="auto" />
                    <el-option label="light" value="light" />
                    <el-option label="dark" value="dark" />
                </el-select>
            </el-form-item>
            <el-form-item label="Mail Notify" prop="mailNotify">
                <el-switch v-model="params.isMailNotice" />
            </el-form-item>
            <el-form-item label="Phone Notify" prop="phoneNotify">
                <el-switch v-model="params.isPhoneNotice" />
            </el-form-item>
        </el-form>
        <div class="flex flex-row justify-center items-center">
            <el-button type="primary" @click="handleSave">
                <el-icon class="mr-2" :size="15">
                    <i-ep-circle-check />
                </el-icon>
                Sava
            </el-button>
        </div>
    </div>
</template>
