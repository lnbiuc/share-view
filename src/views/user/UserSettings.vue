<script setup lang="ts">
import UserSettingsLayout from "../../layout/UserSettingsLayout.vue";
</script>

<template>
    <user-settings-layout>
        <template #left>
            <div class="flex flex-col m-2">
                <el-button class="w-full">
                    Change Profile
                </el-button>
                <el-button class="w-full">
                    Change Password
                </el-button>
                <el-button class="w-full">
                    Notify Setting
                </el-button>
            </div>
        </template>
        <template #right>
            <div class="bg-gray-200 w-full h-full">

            </div>
        </template>
    </user-settings-layout>
</template>
