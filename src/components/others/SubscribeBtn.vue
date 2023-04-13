<script setup lang="ts">
import { subscribeAuthorByAuthorId, subscribeQuestionById } from '../../axios/api/subscribeApi';
import { ElMessage } from 'element-plus';

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
    if (isSubscribed) {
        return;
    }
    if (type === 'user') {
        if (userId === '') {
            return;
        } else {
            subscribeAuthorByAuthorId(userId).then((res) => {
                if (res.data.code == 200) {
                    isDisableSubscribeBtn.value = true;
                    emit('reloadSubscribe');
                    ElMessage.success('SUCCESS');
                } else if (res.data.code == 722) {
                    isDisableSubscribeBtn.value = true;
                    ElMessage.warning('you already subscribed');
                }
            });
        }
    } else {
        if (questionId === '') {
            return;
        } else {
            subscribeQuestionById(questionId).then((res) => {
                if (res.data.code == 200) {
                    isDisableSubscribeBtn.value = true;
                    ElMessage.success('SUCCESS');
                    emit('reloadSubscribe');
                } else if (res.data.code == 722) {
                    isDisableSubscribeBtn.value = true;
                    ElMessage.warning('you already subscribed');
                }
            });
        }
    }
};

const emit = defineEmits(['reloadSubscribe']);
</script>

<template>
    <el-button @click="handleSubscribe" type="primary" v-if="!isDisableSubscribeBtn" plain> Subscribe</el-button>
    <el-button type="primary" :disabled="true" v-if="isDisableSubscribeBtn" plain>
        <i-ep-circle-check class="mr-1" />
        Subscribed
    </el-button>
</template>
