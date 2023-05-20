<script setup lang="ts">
import {
    getUserProfile,
    updateUserPassword,
    UpdateUserPasswordEntity,
    UserProfileEntity,
} from '../../../axios/api/userApi';
import { ref, Ref } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { sendCode } from '../../../axios/api/loginApi';
import { useUserSettingStore } from '../../../pinia';
import { updateUserInfo } from '../../../utils';
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
        flush: 'sync',
    }
);

const pwdUpdateParams: Ref<UpdateUserPasswordEntity> = ref({
    password: '',
    phone: '',
    email: '',
    code: '',
});

const form = ref<{ account: string; code: string; pwd: string }>({
    account: '',
    code: '',
    pwd: '',
});

const count = ref<number>(60);
const sendCodeStatus = ref<boolean>(false);
const validateAccount = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('account is required'));
    } else if (value.indexOf('@') == -1) {
        if (value.match(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/)) {
            callback();
        } else {
            callback(new Error('phone format error'));
        }
    } else {
        if (value.match(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
            callback();
        } else {
            callback(new Error('email format error'));
        }
    }
};
const validateCode = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('code required'));
    } else if (value.match(/^\d{6,}$/)) {
        callback();
    } else {
        callback(new Error('code format error'));
    }
};
const validatePassword = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('password required'));
    } else if (value.match(/^[a-zA-Z0-9_-]{6,18}$/)) {
        callback();
    } else {
        callback(new Error('password format error'));
    }
};

const formRules: FormRules = reactive({
    account: [{ required: true, validator: validateAccount, trigger: 'blur' }],
    code: [{ required: true, validator: validateCode, trigger: 'blur' }],
    pwd: [{ required: true, validator: validatePassword, trigger: 'blur' }],
});

const HandlerSendCode = () => {
    const params = {
        phone: '',
        email: '',
    };
    if (form.value.account.indexOf('@') == -1) {
        params.phone = form.value.account;
    } else {
        params.email = form.value.account;
    }
    if (
        params.phone.match(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/) ||
        params.email.match(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)
    ) {
        sendCode(params).then((res) => {
            if (res.data.code == 200) {
                ElMessage.success(res.data.message);
                sendCodeStatus.value = !sendCodeStatus.value;
                const timer = setInterval(() => {
                    if (count.value > 0) {
                        count.value--;
                    } else {
                        count.value = 60;
                        sendCodeStatus.value = !sendCodeStatus.value;
                        clearInterval(timer);
                    }
                }, 1000);
            } else {
                ElMessage.error(res.data.message);
            }
        });
    }
};

const ruleFormRef = ref<FormInstance>();

const handlerSubmit = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (!valid) {
            return false;
        } else {
            if (form.value.account.indexOf('@') == -1) {
                pwdUpdateParams.value.phone = form.value.account;
            } else {
                pwdUpdateParams.value.email = form.value.account;
            }
            pwdUpdateParams.value.code = form.value.code;
            pwdUpdateParams.value.password = form.value.pwd;
            updateUserPassword(pwdUpdateParams.value).then((res) => {
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
        }
    });
};
</script>

<template>
    <div class="border-light dark:border-dark rounded-md mx-2 mt-2 p-4 dark:bg-dark">
        <el-form
            ref="ruleFormRef"
            :rules="formRules"
            :model="form"
            label-position="right"
            status-icon
            label-width="auto"
        >
            <el-form-item label="Account" prop="account">
                <div class="flex-row flex flex-grow">
                    <el-input placeholder="enter your phone number or email" v-model="form.account" />
                    <el-button class="ml-2" type="success" @click="HandlerSendCode" :disabled="sendCodeStatus">
                        <span v-show="!sendCodeStatus">Send Code</span>
                        <span v-show="sendCodeStatus">{{ count }} s</span>
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="Verify Code" prop="code">
                <el-input placeholder="enter your verify code" v-model="form.code" />
            </el-form-item>
            <el-form-item label="New Password" prop="pwd">
                <el-input placeholder="enter new password" v-model="form.pwd" />
            </el-form-item>
            <div class="flex flex-row justify-center items-center">
                <el-button type="primary" @click="handlerSubmit(ruleFormRef)">Submit</el-button>
            </div>
        </el-form>
    </div>
</template>
