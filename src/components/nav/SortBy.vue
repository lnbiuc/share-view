<script setup lang="ts">
import { ref } from 'vue';
// @ts-ignore
import { ArrowDown } from '@element-plus/icons-vue';
import { useArticleParamsStore, useFilterAndSortStore } from '../../pinia';
import { storeToRefs } from 'pinia';
import { checkLoginStatus } from '../../utils';

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
// init
const store = useFilterAndSortStore();
const currentSelectFilter = ref(filterByList[0].value);
const clickSelectFilter = (filter: { name: string; value: string }) => {
    currentSelectFilter.value = filter.value;
};
const currentSelectSort = ref(sortByList[0].value);
const clickSelectSort = (sort: { name: string; value: string }) => {
    if (sort.value == 'subscribed') {
        if (checkLoginStatus()) {
            currentSelectSort.value = sort.value;
        } else {
            return;
        }
    } else {
        currentSelectSort.value = sort.value;
    }
};

const paramsStore = useArticleParamsStore();

// watch
watch(currentSelectFilter, async () => {
    store.filter = currentSelectFilter.value;
    paramsStore.filterChange(currentSelectFilter.value);
});
watch(currentSelectSort, async () => {
    store.sort = currentSelectSort.value;
    if (currentSelectSort.value == 'subscribed') {
        if (checkLoginStatus()) {
            paramsStore.sortChange(currentSelectSort.value);
        } else {
            return;
        }
    }
    paramsStore.sortChange(currentSelectSort.value);
});
const displayFilter = (val: string) => {
    if (val == 'releaseTime') {
        return 'All Time';
    } else if (val == 'weak') {
        return 'Weak';
    }
    return 'Mouth';
};

const taggerColor = (s: { name: string; value: string }) => {
    if (s.value == currentSelectSort.value) {
        return '#3B82F6';
    } else {
        return 'unset';
    }
};
</script>

<template>
    <div
        class="flex flex-row mt-2 mx-2 p-3 dark:bg-dark justify-between items-center bg-light hover:shadow-md shadow-sm rounded-md transition-all"
    >
        <div class="dark:text-gray-300">
            <span
                class="m-2 cursor-pointer transition-all"
                v-for="s in sortByList"
                @click="clickSelectSort(s)"
                :style="{ color: taggerColor(s) }"
                >{{ s.name }}</span
            >
        </div>
        <div class="flex items-center mr-2">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link align-top cursor-pointer text-base">
                    {{ displayFilter(currentSelectFilter) }}
                    <el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item
                            @click="clickSelectFilter(f)"
                            :disabled="f.value === currentSelectFilter"
                            v-for="f in filterByList"
                            >{{ f.name }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
