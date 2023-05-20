<script setup lang="ts">
import { ref, Ref } from 'vue';
import { UserProfileEntity } from '../../../axios/api/userApi';
import { useUserSettingStore } from '../../../pinia';
import { storeToRefs } from 'pinia';

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
        flush: 'sync', // 模拟 watch 的 immediate: true，立即执行回调函数
    }
);
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
            <el-button type="primary">
                <el-icon class="mr-2" :size="15">
                    <i-ep-circle-check />
                </el-icon>
                Sava
            </el-button>
        </div>
    </div>
</template>
