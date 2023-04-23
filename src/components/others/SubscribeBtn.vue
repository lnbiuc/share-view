<script setup lang="ts">
import { cancelSubscribe, subscribeAuthorByAuthorId, subscribeQuestionById } from '../../axios/api/subscribeApi';
import { ElMessage } from 'element-plus';
import {useDialogControlStore, useUserStore} from "../../pinia";
import {storeToRefs} from "pinia";

const props = defineProps({
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

const isDisableSubscribeBtn = ref<boolean>(props.isSubscribed);

isDisableSubscribeBtn.value = props.isSubscribed;

const handleSubscribe = () => {
    if (props.isSubscribed) {
        return;
    }
    const userStore = useUserStore();
    if (userStore.isLogin) {
        doSubscribe();
    } else {
        const dialogForm = useDialogControlStore();
        dialogForm.loginForm = true;
        const refUserStore = storeToRefs(userStore)
        const unwatch = watch(refUserStore, () => {
            if (refUserStore.isLogin) {
                doSubscribe();
                unwatch();
            }
        })
    }
};

const doSubscribe = () => {
    if (props.type === 'user') {
        if (props.userId === '') {
            return;
        } else {
            subscribeAuthorByAuthorId(props.userId).then((res) => {
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
        if (props.questionId === '') {
            return;
        } else {
            subscribeQuestionById(props.questionId).then((res) => {
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
}

const handleCancelSubscribe = () => {
    if (!props.isSubscribed) {
        return;
    }
    if (props.type === 'user') {
        if (props.userId === '') {
            return;
        } else {
            cancelSubscribe(props.userId, props.questionId, props.type === 'user' ? 1 : 2).then((res) => {
                if (res.data.code == 200) {
                    isDisableSubscribeBtn.value = false;
                    ElMessage.success('SUCCESS');
                } else {
                    ElMessage.warning(res.data.message);
                }
            });
        }
    }
};
</script>

<template>
    <el-button @click="handleSubscribe" type="primary" v-if="!isDisableSubscribeBtn" plain> Subscribe</el-button>
    <el-button @click="handleCancelSubscribe" type="danger" v-if="isDisableSubscribeBtn" plain>
        Cancel Subscribed
    </el-button>
</template>
