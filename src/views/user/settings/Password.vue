<script setup lang="ts">
import { UpdateUserPasswordEntity } from '../../../axios/api/userApi';
import { ref, Ref } from 'vue';
import { FormInstance, FormRules } from 'element-plus';

const params: Ref<UpdateUserPasswordEntity> = ref({
    password: '',
    phone: '',
    email: '',
    code: '',
});

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

const handleSendCode = () => {};

const ruleFormRef = ref<FormInstance>();

const handlerSubmit = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (!valid) {
            return false;
        } else {
        }
    });
};
</script>

<template>
    <div class="border-light dark:border-dark rounded-md mx-2 mt-2 p-4 dark:bg-dark">
        <el-form
            ref="ruleFormRef"
            :rules="formRules"
            :model="params"
            label-position="right"
            status-icon
            label-width="auto"
        >
            <el-form-item label="Account" prop="account">
                <div class="flex-row flex flex-grow">
                    <el-input placeholder="enter your phone number or email" />
                    <el-button class="ml-2" type="success" @click="handleSendCode">Send Code</el-button>
                </div>
            </el-form-item>
            <el-form-item label="Verify Code" prop="code">
                <el-input placeholder="enter your verify code" />
            </el-form-item>
            <el-form-item label="New Password" prop="pwd">
                <el-input placeholder="enter new password" />
            </el-form-item>
            <div class="flex flex-row justify-center items-center">
                <el-button type="primary" @click="handlerSubmit(ruleFormRef)">Submit</el-button>
            </div>
        </el-form>
    </div>
</template>
