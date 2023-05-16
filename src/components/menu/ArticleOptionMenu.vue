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
    <div v-if="deleteOpt || hiddenOpt || modifyOpt">
        <el-dropdown trigger="click">
            <el-button class="el-dropdown-link" text bg type="info">
                <el-icon :size="20">
                    <i-ep-more />
                </el-icon>
            </el-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-if="deleteOpt" @click="emit('handleDelete')">Delete</el-dropdown-item>
                    <el-dropdown-item v-if="hiddenOpt" @click="emit('handleHidden')">Hidden</el-dropdown-item>
                    <el-dropdown-item v-if="modifyOpt" @click="emit('handleModify')">Modify</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
