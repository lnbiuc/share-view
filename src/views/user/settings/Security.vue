<script setup lang="ts">
import { Lock } from '@element-plus/icons-vue';
import { sendCode } from '../../../axios/api/loginApi';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { ref, Ref } from 'vue';
import { getUserProfile, updateUserAccount, UserProfileEntity } from '../../../axios/api/userApi';
import { useUserSettingStore } from '../../../pinia';
import { storeToRefs } from 'pinia';
import { updateUserInfo } from '../../../utils';

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

const updateForm = ref<{ phone: string; email: string; pwd: string; phoneCode: string; emailCode: string }>({
    phone: '',
    email: '',
    pwd: '',
    phoneCode: '',
    emailCode: '',
});

const phoneSendCodeStatus = ref<boolean>(false);
const emailSendCodeStatus = ref<boolean>(false);
const phoneCount = ref<number>(60);
const emailCount = ref<number>(60);
const isPhoneSendCodeSuccess = ref<boolean>(false);
const isEmailSendCodeSuccess = ref<boolean>(false);

const pwdFrom = ref<{ pwd: string; repeatPwd: string }>({
    pwd: '',
    repeatPwd: '',
});

const userSettingStore = useUserSettingStore();
const refUserSettingStore = storeToRefs(userSettingStore);
params.value = userSettingStore.params;
watchEffect(
    () => {
        params.value = refUserSettingStore.params.value;
        updateForm.value.phone = params.value.phone;
        updateForm.value.email = params.value.mail;
    },
    {
        flush: 'sync',
    }
);

const HandlerSendCode = (index: number) => {
    const params = {
        phone: '',
        email: '',
    };
    if (index === 0) {
        params.phone = updateForm.value.phone;
        if (params.phone.match(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/)) {
            sendCode(params).then((res) => {
                if (res.data.code == 200) {
                    ElMessage.success(res.data.message);
                    phoneSendCodeStatus.value = !phoneSendCodeStatus.value;
                    isPhoneSendCodeSuccess.value = true;
                    const timer = setInterval(() => {
                        if (phoneCount.value > 0) {
                            phoneCount.value--;
                        } else {
                            phoneCount.value = 60;
                            phoneSendCodeStatus.value = !phoneSendCodeStatus.value;
                            clearInterval(timer);
                        }
                    }, 1000);
                } else {
                    ElMessage.error(res.data.message);
                }
            });
        } else {
            ElMessage.warning('Please enter the correct phone number');
            return;
        }
    } else {
        params.email = updateForm.value.email;
        if (params.email.match(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
            sendCode(params).then((res) => {
                if (res.data.code == 200) {
                    ElMessage.success(res.data.message);
                    emailSendCodeStatus.value = !emailSendCodeStatus.value;
                    isEmailSendCodeSuccess.value = true;
                    const timer = setInterval(() => {
                        if (emailCount.value > 0) {
                            emailCount.value--;
                        } else {
                            emailCount.value = 60;
                            emailSendCodeStatus.value = !emailSendCodeStatus.value;
                            clearInterval(timer);
                        }
                    }, 1000);
                } else {
                    ElMessage.error(res.data.message);
                }
            });
        } else {
            ElMessage.warning('Please enter the correct email');
            return;
        }
    }
};

const handleClickSave = (index: number) => {
    let account: string;
    let code: string;
    if (index === 0) {
        account = updateForm.value.phone;
        code = updateForm.value.phoneCode;
    } else {
        account = updateForm.value.email;
        code = updateForm.value.emailCode;
    }
    updateUserAccount(account, code).then((res) => {
        if (res.data.code === 200) {
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
</script>

<template>
    <div class="border-light dark:border-dark rounded-md mx-2 mt-2 p-4 dark:bg-dark">
        <el-form :model="updateForm" label-position="right" status-icon label-width="auto">
            <el-divider>PHONE</el-divider>
            <el-form-item label="Phone" prop="phone">
                <div class="flex-row flex flex-grow">
                    <el-input v-model="updateForm.phone" type="text" placeholder="enter your phone number" />
                    <el-button class="ml-2" type="warning" @click="HandlerSendCode(0)" :disabled="phoneSendCodeStatus">
                        <span v-show="!phoneSendCodeStatus">Send Code</span>
                        <span v-show="phoneSendCodeStatus">{{ phoneCount }} s</span>
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="Phone Code">
                <div class="flex-row flex flex-grow">
                    <el-input v-model="updateForm.phoneCode" type="text" placeholder="enter your phone code" />
                    <el-button class="ml-2" type="primary" @click="handleClickSave(0)">Chang Phone Number </el-button>
                </div>
            </el-form-item>
            <el-divider>EMAIL</el-divider>
            <el-form-item label="Email" prop="email">
                <div class="flex-row flex flex-grow">
                    <el-input v-model="updateForm.email" type="text" placeholder="enter your email" />
                    <el-button class="ml-2" type="warning" @click="HandlerSendCode(1)" :disabled="emailSendCodeStatus">
                        <span v-show="!emailSendCodeStatus">Send Code</span>
                        <span v-show="emailSendCodeStatus">{{ emailCount }} s</span>
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="Email Code">
                <div class="flex-row flex flex-grow">
                    <el-input v-model="updateForm.emailCode" type="text" placeholder="enter your email code" />
                    <el-button class="ml-2" type="primary" @click="handleClickSave(1)">Chang Email Address </el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>
