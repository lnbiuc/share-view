<script setup lang="ts">
import { useDialogControlStore } from '../../pinia';

const dialogControlStore = useDialogControlStore()
</script>

<template>
    <el-dialog
        v-model="dialogControlStore.askQuestionForm.status"
        :fullscreen="true"
        :show-close="false"
        :draggable="true">
        <template #header="{ close, titleId, titleClass }">
            <div class="flex flex-row justify-between px-6">
                <h4 :id="titleId" :class="titleClass">
                    <el-icon class="el-icon--left">
                        <i-ep-edit-pen/>
                    </el-icon>
                    Ask Question
                </h4>
                <el-button type="danger" @click="close">
                    <el-icon class="el-icon--left">
                        <i-ep-circle-close-filled/>
                    </el-icon>
                    Close
                </el-button>
            </div>
        </template>
        <template #footer>
            <div class="flex flex-row justify-end mr-4 px-6">
                <el-button type="primary" @click="handlePublish()">
                    <el-icon class="el-icon--left">
                        <i-ep-circle-check/>
                    </el-icon>
                    Publish
                </el-button>
            </div>
        </template>

    </el-dialog>
</template>

