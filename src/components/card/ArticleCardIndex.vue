<template>
    <div class="text-center">
        <div v-if="isLoad" class="flex flex-col justify-center items-center my-20">
            <el-icon :size="60" class="animate-spin"><Loading/></el-icon>
            <span class="text-3xl mt-4 text-gray-500">
                Loading
            </span>
        </div>
        <div
            v-for="a in articleList"
            :key="a.articleId"
            v-if="!isLoad"
            class="flex flex-col p-5 dark:bg-dark bg-white hover:shadow-md shadow-sm mt-2 mx-2 rounded-md transition-all"
        >
            <div class="flex flex-row p-0 text-gray-400">
                <div class="truncate">
                    <span class="hover:text-blue-500 cursor-pointer transition-all">{{ a.author.username }} · </span>
                    <span v-text="formatTime(a.releaseTime)"></span>
                    <span class="hover:text-blue-500 cursor-pointer transition-all" v-for="t in a.tags" :key="t.tagId">
                        · {{ t.tagName }}</span
                    >
                </div>
            </div>
            <div class="flex flex-row m">
                <div class="my-2 flex flex-row align-middle">
                    <div
                        class="mr-2 rounded-full m-auto transition-all type cursor-pointer"
                        :style="{ backgroundColor: tagBgColor(a.type) }"
                        style="width: 80px"
                    >
                        {{ a.type }}
                    </div>
                    <div
                        class="text-lg hover:text-blue-500  py-2 cursor-pointer transition-all"
                        @click="$router.push({ path: '/a/' + a.articleId })"
                    >
                        {{ a.title }}
                    </div>
                </div>
            </div>
            <div class="flex mb-4 text-gray-500 truncate">
                {{ a.introduction }}
            </div>
            <div class="flex flex-row justify-start">
                <CommentsLink :comments="a.comments" />
                <ShareLink />
                <CollectionLink />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ShareLink from '../index/articleList/ShareLink.vue';
import CollectionLink from '../index/articleList/CollectionLink.vue';
import CommentsLink from '../index/articleList/CommentsLink.vue';
import { ArticleListEntity, getArticleList, getArticleListBySubscribe } from "../../api/article/articleApi";
import { formatTime } from "../../utils";
import { ref } from 'vue';
import { useArticleParamsStore, useDialogControlStore, useFilterAndSortStore, useUserStore } from "../../pinia";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
// @ts-ignore
import { Loading } from '@element-plus/icons-vue'
const articleList = ref<ArticleListEntity[]>();
// init request
const data = ref({
    pageNumber: 1,
    pageSize: 7,
    filterBy: {
        authorId: '',
        categoryId: 0,
        tagId: 0,
        type: 0,
        startDay: '',
        endDay: '',
    },
    sortBy: {
        hot: true,
        releaseTime: false,
    },
});
getArticleList(data.value).then((res) => {
    articleList.value = res.data.data.data;
});

const tagBgColor = (type: string) => {
    switch (type) {
        case 'Post':
            return '#eebe77';
        case 'Question':
            return '#95d475';
        case 'Article':
            return '#79bbff';
        case 'Video':
            return '#fab6b6';
    }
};
const isLoad = ref<boolean>(false)
const store = useFilterAndSortStore()
const refStore = storeToRefs(store)
watch(refStore.filter, async () => {
    const paramsStore = useArticleParamsStore()
    paramsStore.filterChange(refStore.filter.value)
    isLoad.value = true
    getArticleList(paramsStore.params).then((res) => {
        articleList.value = res.data.data.data;
        isLoad.value = false
    });
});

watch(refStore.sort, async () => {
    if (refStore.sort.value == 'subscribed') {
        const store = useUserStore();
        if (store.isLogin) {
            getArticleListBySubscribe(store.getUserId, 1, 10).then((res) => {
                articleList.value = res.data.data.data;
            });
        } else {
            const dialogControl = useDialogControlStore()
            dialogControl.loginForm = true
            const refUserStore = storeToRefs(store)
            watch(refUserStore.isLogin, async () => {
                getArticleListBySubscribe(store.getUserId, 1, 10).then((res) => {
                    articleList.value = res.data.data.data;
                });
            })
        }
        return
    }
    const paramsStore = useArticleParamsStore()
    paramsStore.sortChange(refStore.sort.value)
    isLoad.value = true
    getArticleList(paramsStore.params).then((res) => {
        articleList.value = res.data.data.data;
        isLoad.value = false
    });
})
</script>
<style scoped>
.type {
    opacity: 0.9;
}
.type:hover {
    opacity: 1;
}
</style>
