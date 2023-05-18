<script setup lang="ts">
const emit = defineEmits(['handleDelete']);
</script>

<template>
    <div v-if="$route.name === 'Profile | Comment'">
        <el-dropdown trigger="click">
            <el-button class="el-dropdown-link" text bg type="info">
                <el-icon :size="20">
                    <i-ep-more />
                </el-icon>
            </el-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="emit('handleDelete')">
                        <el-icon><i-ep-delete /></el-icon>
                        Delete
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
