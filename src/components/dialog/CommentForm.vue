<script setup lang="ts">
import { useDialogControlStore } from '../../pinia';

const dialogStore = useDialogControlStore()

</script>

<template>
    <el-dialog class="p-6" v-model="dialogStore.commentForm.status" width="30%" title="Create Comment" :draggable="true">

    </el-dialog>
</template>
