<script setup lang="ts">
defineProps({
    deleteOpt: {
        type: Boolean,
        default: false,
        require: false,
    },
    hiddenOpt: {
        type: Boolean,
        default: false,
        require: false,
    },
    modifyOpt: {
        type: Boolean,
        default: false,
        require: false,
    },
});

const emit = defineEmits(['handleDelete', 'handleHidden', 'handleModify']);
</script>

<template>
    <div v-if="(deleteOpt || hiddenOpt || modifyOpt) && $route.name === 'Profile | Publish'">
        <el-dropdown trigger="click">
            <el-button class="el-dropdown-link" text bg type="info">
                <el-icon :size="20">
                    <i-ep-more />
                </el-icon>
            </el-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-if="deleteOpt" @click="emit('handleDelete')">
                        <el-icon><i-ep-delete /></el-icon>
                        Delete
                    </el-dropdown-item>
                    <el-dropdown-item v-if="hiddenOpt" @click="emit('handleHidden')">
                        <el-icon><i-ep-remove /></el-icon>
                        Hidden
                    </el-dropdown-item>
                    <el-dropdown-item divided v-if="modifyOpt" @click="emit('handleModify')">
                        <el-icon><i-ep-edit /></el-icon>
                        Modify
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
