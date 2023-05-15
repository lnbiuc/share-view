<script setup lang="ts">
import { ref } from 'vue';
import { useRouteParams } from '@vueuse/router';
import { getLikedAnswerByUserId } from '../../../../axios/api/likesApi';

const timeList = ref<string[]>([]);

const userId = useRouteParams<string>('userId');

const params = ref<{ pageNumber: number; pageSize: number; total: number }>({ pageNumber: 1, pageSize: 10, total: 0 });

const getLikedAnswer = () => {
    getLikedAnswerByUserId(userId.value, params.value.pageNumber, params.value.pageSize).then((res) => {});
};

onMounted(() => {
    getLikedAnswer();
});
</script>

<template>w</template>

<style scoped></style>
