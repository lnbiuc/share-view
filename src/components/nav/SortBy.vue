<script setup lang="ts">
import { ref } from 'vue';
// @ts-ignore
import { ArrowDown } from '@element-plus/icons-vue';
import { useFilterAndSortStore } from "../../pinia";

const filterByList: Array<{ name: string; value: string }> = [
    {
        name: 'All Time',
        value: 'releaseTime',
    },
    {
        name: 'This Weak',
        value: 'weak',
    },
    {
        name: 'This Mouth',
        value: 'mouth',
    },
];
const sortByList: Array<{ name: string; value: string }> = [
    {
        name: 'Hot',
        value: 'hot',
    },
    {
        name: 'New',
        value: 'new',
    },
    {
        name: 'Subscribed',
        value: 'subscribed',
    },
];
const store = useFilterAndSortStore()
const currentSelectFilter = ref(filterByList[0].name);
const clickSelectFilter = (filter: { name: string; value: string }) => {
    currentSelectFilter.value = filter.value;
};
const currentSelectSort = ref(sortByList[0].name);
const clickSelectSort = (sort: { name: string; value: string }) => {
    currentSelectSort.value = sort.value;
};
watch(currentSelectFilter, async () => {
    store.filter = currentSelectFilter.value;
});
watch(currentSelectSort, async () => {
    store.sort = currentSelectSort.value;
});
</script>

<template>
    <div
        class="flex flex-row mt-2 mx-2 p-3 dark:bg-dark justify-between items-center bg-white hover:shadow-md shadow-sm rounded-md transition-all"
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
                <span class="el-dropdown-link align-top cursor-pointer">
                    {{ currentSelectFilter }}
                    <el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item
                            @click="clickSelectFilter(f)"
                            :disabled="f.name === currentSelectFilter"
                            v-for="f in filterByList"
                            >{{ f.name }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
