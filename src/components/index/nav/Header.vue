<template>
    <div
        class="flex lg:flex-row flex-col hover:shadow-md shadow-sm transition-all py-2 mt-2 lg:rounded-full bg-white w-auto"
    >
        <div class="flex flex-1 lg:justify-center justify-start">
            <div class="py-2 mx-20 hover:text-purple-600 lg:flex-row flex-col">
                <span class="m-1 cursor-pointer" @click="$router.push({ path: '/' })">Share</span>
            </div>
            <div class="flex flex-1 expand-btn justify-end items-center text-3xl m-auto mr-3">
                <el-dropdown trigger="click" class="mr-6" v-if="hasLogin">
                    <span class="el-dropdown-link flex flex-row items-center">
                        <el-avatar shape="circle" :src="loginUser.avatar" />
                        <el-icon class="text-lg"><ArrowDown /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>
                                <el-icon><User /></el-icon>
                                My Profile
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-icon><Setting /></el-icon>
                                Settings
                            </el-dropdown-item>
                            <el-dropdown-item @click="logout">
                                <el-icon><Remove /></el-icon>
                                Logout
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-icon id="icon" @click="handlerShowNav" class="cursor-pointer hover:text-purple-600"
                    ><Fold
                /></el-icon>
            </div>
        </div>
        <div class="flex flex-2 navs lg:justify-center lg:flex-row transition-all lg:mt-0 flex-col">
            <div
                v-for="nav in navs"
                :key="nav.name"
                @click="$router.push({ path: nav.path })"
                class="lg:p-2 p-3 lg:mx-0 mx-40 text-center hover:bg-purple-300 hover:rounded-full transition-all cursor-pointer"
            >
                <span class="m-1">{{ nav.name }}</span>
            </div>
        </div>
        <div class="flex flex-1 justify-center login-btn">
            <div
                class="px-2 py-2 bg-purple-200 hover:bg-purple-300 rounded-full transition-all cursor-pointer"
                @click="dialogFormVisible = true"
                v-if="!hasLogin"
            >
                <span class="m-2">Login / Register</span>
            </div>
            <div class="user" v-if="hasLogin">
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link flex flex-row items-center">
                        <el-avatar shape="circle" :src="loginUser.avatar" />
                        <span class="ml-2 text-md">{{ loginUser.username }}</span
                        >&nbsp;
                        <el-icon class="text-lg"><ArrowDown /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>
                                <el-icon><User /></el-icon>
                                My Profile
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-icon><Setting /></el-icon>
                                Settings
                            </el-dropdown-item>
                            <el-dropdown-item @click="logout">
                                <el-icon><Remove /></el-icon>
                                Logout
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
    <el-dialog class="p-6" v-model="dialogFormVisible" width="30%" title="Login / Register" :draggable="true">
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
                <el-input prefix-icon="user" v-model="pwdForm.account" type="text" placeholder="phone or email" />
            </el-form-item>
            <el-form-item label="Password" prop="pwd">
                <el-input prefix-icon="lock" v-model="pwdForm.pwd" type="password" placeholder="enter your password" />
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
                <el-input prefix-icon="user" v-model="codeForm.account" type="text" placeholder="your phone or email">
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
                    prefix-icon="CircleCheck"
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
                    prefix-icon="user"
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
                    prefix-icon="CircleCheck"
                    v-model="registerForm.code"
                    type="text"
                    placeholder="enter six bit number"
                />
            </el-form-item>
            <el-form-item label="Password" prop="pwd">
                <el-input
                    prefix-icon="lock"
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
                    <el-icon class="mx-2"><InfoFilled /></el-icon>
                </el-tooltip>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="handlerSubmit(ruleFormRef)"> Confirm </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { login, loginParams, register, sendCode, userEntity } from '../../../api/login/loginApi';
import { ElMessage, FormInstance } from 'element-plus';
import { useUserStore } from '../../../pinia';

const showNav = ref<boolean>(false);
const handlerShowNav = () => {
    showNav.value = !showNav.value;
    const el = document.getElementsByClassName('navs')[0];
    const icon = document.getElementById('icon');
    const loginBtn = document.getElementsByClassName('login-btn')[0];
    if (showNav.value) {
        // @ts-ignore
        el.style.display = 'flex';
        // @ts-ignore
        icon.classList.add('menu');
        // @ts-ignore
        loginBtn.style.display = 'flex';
    } else {
        // @ts-ignore
        el.style.display = 'none';
        // @ts-ignore
        icon.classList.remove('menu');
        // @ts-ignore
        loginBtn.style.display = 'none';
    }
};
// navs
const navs = [
    {
        name: 'Article',
        path: '/a',
    },
    {
        name: 'Question',
        path: '/q',
    },
    {
        name: 'Post',
        path: '/p',
    },
    {
        name: 'Video',
        path: '/v',
    },
    {
        name: 'Category',
        path: '/c',
    },
];
// dialog control
const dialogFormVisible = ref(false);
// form type control
const handlerType = ref(0);
// api data type
const data = ref<loginParams>({
    rememberMe: true,
    phone: '',
    email: '',
    code: '',
    password: '',
});
// form type0
const pwdForm = ref<{ account: string; pwd: string }>({ account: '', pwd: '' });
// form type1
const codeForm = ref<{ code: string; account: string }>({
    code: '',
    account: '',
});
// form type2
const registerForm = ref<{
    account: string;
    code: string;
    pwd: string;
}>({
    account: '',
    code: '',
    pwd: '',
});
const ruleFormRef = ref<FormInstance>();

// validate function
const validateAccount = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('account is required'));
    } else if (value.indexOf('@') == -1) {
        // account type phone
        if (value.match(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/)) {
            callback();
        } else {
            callback(new Error('phone format error'));
        }
    } else {
        // account type email
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
// form validate
const pwdFormRules = reactive({
    account: [{ required: true, validator: validateAccount, trigger: 'blur' }],
    pwd: [{ required: true, validator: validatePassword, trigger: 'blur' }],
});
const codeFormRules = reactive({
    account: [{ required: true, validator: validateAccount, trigger: 'blur' }],
    code: [{ required: true, validator: validateCode, trigger: 'blur' }],
});
const registerFormRules = reactive({
    account: [{ required: true, validator: validateAccount, trigger: 'blur' }],
    code: [{ required: true, validator: validateCode, trigger: 'blur' }],
    pwd: [{ required: true, validator: validatePassword, trigger: 'blur' }],
});
// submit form and login
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
                        dialogFormVisible.value = false;
                        loginSuccess(res.data.data.user, res.data.data.token);
                    } else {
                        ElMessage.error(res.data.message);
                    }
                });
                return;
            }
            login(data.value).then((res) => {
                if (res.data.code == 200) {
                    ElMessage.success(res.data.message);
                    dialogFormVisible.value = false;
                    loginSuccess(res.data.data.user, res.data.data.token);
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
// send code
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

// login success
const hasLogin = ref<boolean>(false);
const loginUser = ref({});
const loginSuccess = (userData: userEntity, token: string) => {
    cleanData();
    loginUser.value = userData;
    hasLogin.value = true;
    const store = useUserStore();
    store.user = userData;
    store.token = token;
    if (data.value.rememberMe) {
        window.localStorage.setItem('user', JSON.stringify(userData));
        window.localStorage.setItem('token', token);
    } else {
        window.sessionStorage.setItem('user', JSON.stringify(userData));
        window.sessionStorage.setItem('token', token);
    }
};

const logout = () => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    ElMessage.success('logout success');
    hasLogin.value = false;
};

onMounted(() => {
    const localUser = window.localStorage.getItem('user');
    const sessionUser = window.sessionStorage.getItem('user');
    const localToken = window.localStorage.getItem('token');
    const sessionToken = window.sessionStorage.getItem('token');
    const store = useUserStore();
    if (localUser && localUser !== '' && localToken && localToken !== '') {
        loginUser.value = JSON.parse(localUser);
        hasLogin.value = true;
        store.user = JSON.parse(localUser);
        store.token = localToken;
        return;
    } else if (sessionUser && sessionUser !== '' && sessionToken && sessionToken !== '') {
        loginUser.value = JSON.parse(sessionUser);
        hasLogin.value = true;
        store.user = JSON.parse(sessionUser);
        store.token = sessionToken;
    }
});
</script>

<style>
@media screen and (max-width: 1440px) {
    .el-dialog {
        width: 40%;
    }
}

@media screen and (max-width: 976px) {
    .el-dialog {
        width: 50%;
    }
    .navs {
        display: none;
    }
    .login-btn {
        display: none;
    }
    .expand-btn {
        display: flex;
    }
}
@media screen and (max-width: 768px) {
    .el-dialog {
        width: 80%;
    }
}
</style>
<style scoped>
.expand-btn {
    display: none;
}

.menu {
    transform: rotate(-90deg);
    transition: all 0.5s ease;
}

#icon {
    transition: all 0.5s ease;
}
@media screen and (max-width: 976px) {
    .login-btn,
    .user,
    .navs {
        display: none;
    }
    .expand-btn {
        display: flex;
    }
}
</style>
