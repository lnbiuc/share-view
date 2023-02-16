<script setup lang="ts">
const props = defineProps({
    isDisplay: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div v-if="props.isDisplay" class="flex flex-col justify-center items-center my-20">
        <el-empty description="No Result!" />
    </div>
</template>

