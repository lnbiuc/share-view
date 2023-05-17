<script setup lang="ts">
import { Ref, ref } from 'vue';
import { useRouteParams } from '@vueuse/router';
import { getLikedAnswerByUserId, UserLikedAnswerEntity } from '../../../../axios/api/likesApi';

const userId = useRouteParams<string>('userId');

const params = ref<{ pageNumber: number; pageSize: number; total: number }>({ pageNumber: 1, pageSize: 10, total: 0 });

const answerList: Ref<UserLikedAnswerEntity[]> = ref([
    {
        likeId: 77,
        articleId: '',
        answerId: '',
        questionDescribe: '',
        answer: {
            id: '',
            toId: '',
            author: {
                userId: '',
                username: '',
                signature: '',
                avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
                level: 0,
                registerTime: '',
                lastLogin: '',
                ipAddr: '',
                isSubscribed: false,
            },
            content: '',
            releaseTime: '',
            lastUpdate: '',
            like: 0,
            dislike: 0,
            comments: null,
        },
        executeTime: '',
    },
]);

const isLoad = ref<boolean>(false);

const getLikedAnswer = () => {
    isLoad.value = true;
    getLikedAnswerByUserId(userId.value, params.value.pageNumber, params.value.pageSize).then((res) => {
        answerList.value = res.data.data.data;
        params.value.total = res.data.data.total;
        isLoad.value = false;
    });
};

onMounted(() => {
    getLikedAnswer();
});
</script>

<template>
    <div class="ml-2 mt-2">
        <loading :is-loading="isLoad" />
        <user-liked-answer-list :answerList="answerList" />
    </div>
</template>

<style scoped></style>
