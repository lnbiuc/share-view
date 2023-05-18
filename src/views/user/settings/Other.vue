<script setup lang="ts">
const params = ref({
    theme: 'auto',
    mailNotify: false,
    phoneNotify: false,
});
</script>

<template>
    <div class="border-light dark:border-dark rounded-md mx-2 mt-2 p-8 dark:bg-dark">
        <el-form v-model="params" label-position="right" status-icon label-width="auto">
            <el-form-item label="Theme" prop="theme">
                <el-select v-model="params.theme" placeholder="Theme">
                    <el-option label="auto" value="auto" />
                    <el-option label="light" value="light" />
                    <el-option label="dark" value="dark" />
                </el-select>
            </el-form-item>
            <el-form-item label="Mail Notify" prop="mailNotify">
                <el-switch v-model="params.mailNotify" />
            </el-form-item>
            <el-form-item label="Phone Notify" prop="phoneNotify">
                <el-switch v-model="params.phoneNotify" />
            </el-form-item>
        </el-form>
        <div class="flex flex-row justify-center items-center">
            <el-button type="primary">
                <el-icon class="mr-2" :size="15">
                    <i-ep-circle-check />
                </el-icon>
                Sava
            </el-button>
        </div>
    </div>
</template>
