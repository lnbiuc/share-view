<template>
    <div class="">
        <div class="flex flex-row">
            <div class="flex">
                <div class="flex flex-row bg-purple-200 rounded-md text-purple-900 p-0.5 px-2 mr-1">
                    <img src="../../../assets/icon/arrows_up_full..svg" class="w-4 h-4 m-auto" alt="" />&nbsp;
                    <span>Like {{ likes }}</span>
                </div>
                <div class="flex bg-purple-200 rounded-md text-purple-900 p-0.5 px-2">
                    <img src="../../../assets/icon/arrows_down_full..svg" class="w-4 h-4 m-auto text-center" alt="" />
                </div>
                <span> </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    likes: {
        type: Number,
        default: 0,
    },
});
</script>
