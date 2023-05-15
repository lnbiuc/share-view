<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { ref } from 'vue';

const userId = useRouteParams<string>('userId');

const params = ref<{ pageNumber: number; pageSize: number; total: number }>({ pageNumber: 1, pageSize: 10, total: 0 });

const getUserCollect = () => {};
</script>

<template></template>
