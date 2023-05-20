<script setup lang="ts">
import { cancelSubscribe, subscribeAuthorByAuthorId, subscribeQuestionById } from '../../axios/api/subscribeApi';
import { ElMessage } from 'element-plus';
import { useDialogControlStore, useUserStore } from '../../pinia';
import { storeToRefs } from 'pinia';

const { isSubscribed, userId, questionId, type } = defineProps({
    isSubscribed: {
        type: Boolean,
        default: false,
        required: true,
    },
    userId: {
        type: String,
        default: '',
        required: true,
    },
    questionId: {
        type: String,
        default: '',
        required: false,
    },
    type: {
        type: String,
        validator: (value: string) => {
            return ['user', 'question'].includes(value);
        },
        required: false,
        default: 'user',
    },
});

const isDisableSubscribeBtn = ref<boolean>(isSubscribed);

const handleSubscribe = () => {
    if (isDisableSubscribeBtn.value) {
        return;
    }
    const userStore = useUserStore();
    if (userStore.isLogin) {
        doSubscribe();
    } else {
        const dialogForm = useDialogControlStore();
        dialogForm.loginForm = true;
        const refUserStore = storeToRefs(userStore);
        const unwatch = watch(refUserStore, () => {
            if (refUserStore.isLogin) {
                doSubscribe();
                unwatch();
            }
        });
    }
};

const doSubscribe = () => {
    if (type === 'user') {
        if (userId === '') {
            return;
        } else {
            subscribeAuthorByAuthorId(userId).then((res) => {
                if (res.data.code == 200) {
                    isDisableSubscribeBtn.value = true;
                    ElMessage.success('SUCCESS');
                } else if (res.data.code == 722) {
                    isDisableSubscribeBtn.value = true;
                    ElMessage.warning('you already subscribed');
                }
            });
            return;
        }
    } else {
        if (questionId === '') {
            return;
        } else {
            subscribeQuestionById(questionId).then((res) => {
                if (res.data.code == 200) {
                    isDisableSubscribeBtn.value = true;
                    ElMessage.success('SUCCESS');
                } else if (res.data.code == 722) {
                    isDisableSubscribeBtn.value = true;
                    ElMessage.warning('you already subscribed');
                }
            });
        }
    }
};

const handleCancelSubscribe = () => {
    if (!isDisableSubscribeBtn.value) {
        return;
    }
    if (type === 'user') {
        if (userId === '') {
            return;
        } else {
            cancelSubscribe(userId, questionId, type === 'user' ? 1 : 2).then((res) => {
                if (res.data.code == 200) {
                    isDisableSubscribeBtn.value = false;
                    ElMessage.success('SUCCESS');
                    emit('update');
                } else {
                    ElMessage.warning(res.data.message);
                }
            });
        }
    }
};

const userStore = useUserStore();

const emit = defineEmits(['update']);
</script>

<template>
    <div v-if="!(userStore.user.userId !== '' && userId == userStore.user.userId)">
        <el-button @click="handleSubscribe" type="primary" v-if="!isDisableSubscribeBtn" plain> Subscribe</el-button>
        <el-button @click="handleCancelSubscribe" type="danger" v-if="isDisableSubscribeBtn" plain>
            Cancel Subscribed
        </el-button>
    </div>
</template>
