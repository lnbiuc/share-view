<template>
    <div
        class="flex flex-row mt-2 mx-2 p-3 justify-between items-center bg-white hover:shadow-md shadow-sm rounded-md transition-all"
    >
        <div>
            <span
                class="m-2 cursor-pointer hover:border-blue-500 hover:border-b-2 transition-all"
                v-for="s in sortByList"
                @click="clickSelectSort(s)"
                >{{ s.name }}</span
            >
        </div>
        <div class="flex items-center mr-2">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link align-top">
                    {{ currentSelect }}
                    <el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item
                            @click="clickSelectFilter(f)"
                            :disabled="f.name === currentSelect"
                            v-for="f in filterByList"
                            >{{ f.name }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// @ts-ignore
import { ArrowDown } from '@element-plus/icons-vue';

const props = defineProps<{
    sortByList: Array<{ name: string; value: string }>;
    filterByList: Array<{ name: string; value: string }>;
}>();
const emit = defineEmits(['sortBy', 'filterBy']);
const currentSelect = ref(props.filterByList[0].name);
const clickSelectFilter = (filter: { name: string; value: string }) => {
    currentSelect.value = filter.name;
    emit('filterBy', filter.value);
};
const clickSelectSort = (sort: { name: string; value: string }) => {
    emit('sortBy', sort.value);
};
</script>

<style scoped></style>
