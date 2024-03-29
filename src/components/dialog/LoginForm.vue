<script setup lang="ts">
import { InfoFilled, User, Lock, CircleCheck } from '@element-plus/icons-vue';
// dialog control
import { Ref, ref } from 'vue';
import { CountEntity, login, loginParams, register, sendCode, UserEntity } from '../../axios/api/loginApi';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useDialogControlStore, useThemeStore, useUserStore } from '../../pinia';
import { useLocalStorage, useSessionStorage } from '@vueuse/core';
import { switchTheme } from '../../utils';

const dialogStore = useDialogControlStore();
const handlerType = ref(0);
const data: Ref<loginParams> = ref({
    rememberMe: true,
    phone: '',
    email: '',
    code: '',
    password: '',
});
const pwdForm: Ref<{ account: string; pwd: string }> = ref({ account: '', pwd: '' });
const codeForm: Ref<{ code: string; account: string }> = ref({
    code: '',
    account: '',
});
const registerForm: Ref<{
    account: string;
    code: string;
    pwd: string;
}> = ref({
    account: '',
    code: '',
    pwd: '',
});
const ruleFormRef = ref<FormInstance>();

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
const pwdFormRules: FormRules = reactive({
    account: [{ required: true, validator: validateAccount, trigger: 'blur' }],
    pwd: [{ required: true, validator: validatePassword, trigger: 'blur' }],
});
const codeFormRules: FormRules = reactive({
    account: [{ required: true, validator: validateAccount, trigger: 'blur' }],
    code: [{ required: true, validator: validateCode, trigger: 'blur' }],
});
const registerFormRules: FormRules = reactive({
    account: [{ required: true, validator: validateAccount, trigger: 'blur' }],
    code: [{ required: true, validator: validateCode, trigger: 'blur' }],
    pwd: [{ required: true, validator: validatePassword, trigger: 'blur' }],
});
const handlerSubmit = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (!valid) {
            return false;
        } else {
            cleanData();
            if (handlerType.value == 0) {
                if (pwdForm.value.account.indexOf('@') == -1) {
                    data.value.phone = pwdForm.value.account;
                } else {
                    data.value.email = pwdForm.value.account;
                }
                data.value.password = pwdForm.value.pwd;
            } else if (handlerType.value == 1) {
                if (codeForm.value.account.indexOf('@') == -1) {
                    data.value.phone = codeForm.value.account;
                } else {
                    data.value.email = codeForm.value.account;
                }
                data.value.code = codeForm.value.code;
            } else if (handlerType.value == 2) {
                if (registerForm.value.account.indexOf('@') == -1) {
                    data.value.phone = registerForm.value.account;
                } else {
                    data.value.email = registerForm.value.account;
                }
                data.value.password = registerForm.value.pwd;
                data.value.code = registerForm.value.code;
                register(data.value).then((res) => {
                    if (res.data.code == 200) {
                        ElMessage.success(res.data.message);
                        dialogStore.loginForm = false;
                        loginSuccess(res.data.data.user, res.data.data.token, res.data.data.count);
                    } else {
                        ElMessage.error(res.data.message);
                    }
                });
                return;
            }
            login(data.value).then((res) => {
                if (res.data.code == 200) {
                    ElMessage.success(res.data.message);
                    dialogStore.loginForm = false;
                    loginSuccess(res.data.data.user, res.data.data.token, res.data.data.count);
                } else {
                    ElMessage.error(res.data.message);
                }
            });
        }
    });
};

const cleanData = () => {
    data.value = {
        rememberMe: data.value.rememberMe,
        phone: '',
        email: '',
        code: '',
        password: '',
    };
};
const sendCodeStatus = ref<boolean>(false);
const count = ref<number>(60);
const HandlerSendCode = () => {
    const params = {
        phone: '',
        email: '',
    };
    if (handlerType.value == 1) {
        if (codeForm.value.account.indexOf('@') == -1) {
            params.phone = codeForm.value.account;
        } else {
            params.email = codeForm.value.account;
        }
    } else if (handlerType.value == 2) {
        if (registerForm.value.account.indexOf('@') == -1) {
            params.phone = registerForm.value.account;
        } else {
            params.email = registerForm.value.account;
        }
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

const hasLogin = ref<boolean>(false);
const loginUser = ref<UserEntity>({
    userId: '',
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
    theme: '',
    lastLogin: '',
    ipAddr: '',
});
const loginSuccess = (userData: UserEntity, token: string, count: CountEntity) => {
    cleanData();
    loginUser.value = userData;
    hasLogin.value = true;
    const store = useUserStore();
    store.isLogin = true;
    store.user = userData;
    store.token = token;
    store.count = count;
    if (data.value.rememberMe) {
        useLocalStorage<string>('token', token);
        useLocalStorage<UserEntity>('user', userData);
        useLocalStorage<CountEntity>('count', count);
    } else {
        useSessionStorage<string>('token', token);
        useSessionStorage<UserEntity>('user', userData);
        useSessionStorage<CountEntity>('count', count);
    }
    if (userData.theme === 'light') {
        switchTheme(false);
    } else if (userData.theme === 'light') {
        switchTheme(true);
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            switchTheme(true);
        } else {
            switchTheme(false);
        }
    }
};

const themeStore = useThemeStore();
</script>

<template>
    <el-dialog class="p-6" v-model="dialogStore.loginForm" width="500px" title="Login / Register" :draggable="true">
        <div class="mb-4">
            <el-radio-group v-model="handlerType" label="size control">
                <el-radio-button label="0">by Password</el-radio-button>
                <el-radio-button label="1">by Code</el-radio-button>
                <el-radio-button label="2">Register</el-radio-button>
            </el-radio-group>
        </div>
        <el-form
            ref="ruleFormRef"
            :rules="pwdFormRules"
            :model="pwdForm"
            label-position="right"
            status-icon
            label-width="auto"
            v-if="handlerType == 0"
        >
            <el-form-item label="Account" prop="account">
                <el-input :prefix-icon="User" v-model="pwdForm.account" type="text" placeholder="phone or email" />
            </el-form-item>
            <el-form-item label="Password" prop="pwd">
                <el-input :prefix-icon="Lock" v-model="pwdForm.pwd" type="password" placeholder="enter your password" />
            </el-form-item>
        </el-form>
        <el-form
            ref="ruleFormRef"
            :rules="codeFormRules"
            :model="codeForm"
            label-position="right"
            label-width="auto"
            status-icon
            v-if="handlerType == 1"
        >
            <el-form-item label="Account" prop="account">
                <el-input :prefix-icon="User" v-model="codeForm.account" type="text" placeholder="your phone or email">
                    <template #suffix>
                        <el-button @click="HandlerSendCode" :disabled="sendCodeStatus" link>
                            <span v-show="!sendCodeStatus">Send Code</span>
                            <span v-show="sendCodeStatus">{{ count }} s</span>
                        </el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="Code" prop="code">
                <el-input
                    :prefix-icon="CircleCheck"
                    v-model="codeForm.code"
                    type="text"
                    placeholder="enter six bit number"
                />
            </el-form-item>
        </el-form>
        <el-form
            ref="ruleFormRef"
            :rules="registerFormRules"
            :model="registerForm"
            label-position="right"
            label-width="auto"
            status-icon
            v-if="handlerType == 2"
        >
            <el-form-item label="Account" prop="account">
                <el-input
                    :prefix-icon="User"
                    v-model="registerForm.account"
                    type="text"
                    placeholder="your phone or email"
                >
                    <template #suffix>
                        <el-button
                            @click="HandlerSendCode"
                            style="border: none; background-color: unset"
                            :disabled="sendCodeStatus"
                        >
                            <span v-show="!sendCodeStatus">Send Code</span>
                            <span v-show="sendCodeStatus">{{ count }} s</span>
                        </el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="Code" prop="code">
                <el-input
                    :prefix-icon="CircleCheck"
                    v-model="registerForm.code"
                    type="text"
                    placeholder="enter six bit number"
                />
            </el-form-item>
            <el-form-item label="Password" prop="pwd">
                <el-input
                    :prefix-icon="Lock"
                    v-model="registerForm.pwd"
                    type="password"
                    placeholder="supports letters, numbers,_ ,- ,6-18 length "
                />
            </el-form-item>
        </el-form>
        <el-form class="flex justify-end" label-width="auto">
            <el-form-item label="Save login status" class="flex justify-center">
                <el-switch v-model="data.rememberMe" />
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="if enable, your account is wired to this device login for seven days"
                    placement="top-end"
                >
                    <el-icon class="mx-2">
                        <InfoFilled />
                    </el-icon>
                </el-tooltip>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button type="danger" plain @click="dialogStore.loginForm = false">Cancel</el-button>
                <el-button
                    plain
                    color="#626aef"
                    :dark="themeStore.isDark"
                    type="primary"
                    @click="handlerSubmit(ruleFormRef)"
                >
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
