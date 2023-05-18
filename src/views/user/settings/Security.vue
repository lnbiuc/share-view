<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue';
import { sendCode } from '../../../axios/api/loginApi';
import { ElMessage, FormInstance } from 'element-plus';
import { ref, Ref } from 'vue';

const verified = ref<boolean>(false);
const codeForm: Ref<{ code: string; account: string }> = ref({
    code: '',
    account: '',
});

const sendCodeStatus = ref<boolean>(false);
const count = ref<number>(60);

const HandlerSendCode = () => {
    const params = {
        phone: '',
        email: '',
    };
    if (codeForm.value.account.indexOf('@') == -1) {
        params.phone = codeForm.value.account;
    } else {
        params.email = codeForm.value.account;
    }
    if (
        params.phone.match(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/) ||
        params.email.match(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)
    ) {
        sendCode(params).then((res) => {
            if (res.data.code == 150) {
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

const updateForm = ref<{ phone: string; email: string }>({
    phone: '',
    email: '',
});
</script>

<template>
    <div class="border-light dark:border-dark rounded-md mx-2 mt-2 p-4 dark:bg-dark">
        <div v-if="!verified" class="mb-8">
            <div class="text-xl dark:text-dark mb-6 font-semibold text-center text-blue-400">
                <p>You need to verify your identity before you can change your password.</p>
            </div>
            <div>
                <el-form ref="ruleFormRef" :model="codeForm" label-position="right" status-icon label-width="auto">
                    <el-form-item label="Account" prop="account">
                        <div class="flex-row flex flex-grow">
                            <el-input
                                :prefix-icon="User"
                                v-model="codeForm.account"
                                type="text"
                                placeholder="phone or email"
                            />
                            <el-button class="ml-2" type="primary" @click="HandlerSendCode" :disabled="sendCodeStatus">
                                <span v-show="!sendCodeStatus">Send Code</span>
                                <span v-show="sendCodeStatus">{{ count }} s</span>
                            </el-button>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="!sendCodeStatus" label="Code" prop="code">
                        <el-input
                            :prefix-icon="Lock"
                            v-model="codeForm.code"
                            type="text"
                            placeholder="enter six bit number"
                        />
                    </el-form-item>
                </el-form>
                <div class="flex flex-row justify-center items-center">
                    <el-button type="primary">
                        <el-icon class="mr-2" :size="15">
                            <i-ep-circle-check />
                        </el-icon>
                        Verify
                    </el-button>
                </div>
            </div>
        </div>
        <div v-if="!verified">
            <div class="text-xl dark:text-dark mb-6 font-semibold text-center text-green-500">
                <p>verify success</p>
            </div>
            <el-form :model="updateForm" label-position="right" status-icon label-width="auto">
                <el-form-item label="Phone" prop="phone">
                    <div class="flex-row flex flex-grow">
                        <el-input v-model="updateForm.phone" type="text" placeholder="enter your phone number" />
                        <el-button class="ml-2" type="primary" @click="HandlerSendCode" :disabled="sendCodeStatus">
                            <span v-show="!sendCodeStatus">Send Code</span>
                            <span v-show="sendCodeStatus">{{ count }} s</span>
                        </el-button>
                        <el-button class="ml-2" type="success">
                            <span>verify</span>
                        </el-button>
                        <el-button type="primary">
                            <el-icon class="mr-2" :size="15">
                                <i-ep-circle-check />
                            </el-icon>
                            Sava
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <div class="flex-row flex flex-grow">
                        <el-input v-model="updateForm.email" type="text" placeholder="enter your email" />
                        <el-button class="ml-2" type="primary" @click="HandlerSendCode" :disabled="sendCodeStatus">
                            <span v-show="!sendCodeStatus">Send Code</span>
                            <span v-show="sendCodeStatus">{{ count }} s</span>
                        </el-button>
                        <el-button class="ml-2" type="success">
                            <span>verify</span>
                        </el-button>
                        <el-button type="primary">
                            <el-icon class="mr-2" :size="15">
                                <i-ep-circle-check />
                            </el-icon>
                            Sava
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style scoped></style>
