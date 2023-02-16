<template>
    <div class="text-center">
        <div
            v-for="a in articleList"
            :key="a.articleId"
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
import { formatTime } from '../../utils';
import { ref } from 'vue';
import { useDialogControlStore, useFilterAndSortStore, useUserStore } from "../../pinia";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";

const articleList = ref<ArticleListEntity[]>();
const data = ref({
    pageNumber: 1,
    pageSize: 10,
    filterBy: {
        authorId: '',
        categoryId: 0,
        tagId: 0,
        type: 0,
        startDay: '',
        endDay: '',
    },
    sortBy: {
        hot: false,
        releaseTime: true,
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
    }
};
const store = useFilterAndSortStore()
const refStore = storeToRefs(store)
watch(refStore.filter, async () => {
    filterChange(refStore.filter.value)
})
watch(refStore.sort, async () => {
    sortChange(refStore.sort.value)
})

const cleanData = () => {
    data.value = {
        pageNumber: 1,
        pageSize: 5,
        filterBy: {
            authorId: '',
            categoryId: 0,
            tagId: 0,
            type: 0,
            startDay: '',
            endDay: '',
        },
        sortBy: {
            hot: false,
            releaseTime: true,
        },
    };
};

const sortChange = (value: string) => {
    if (value === 'hot') {
        data.value.sortBy.hot = true;
        data.value.sortBy.releaseTime = false;
    } else if (value === 'new') {
        data.value.sortBy.hot = false;
        data.value.sortBy.releaseTime = true;
    } else if (value === 'subscribed') {
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
                sortChange(value)
            })
        }
        return;
    }
    getArticleList(data.value).then((res) => {
        articleList.value = res.data.data.data;
    });
};

const formatDate = (date: object) => {
    let mouth;
    let day;
    // @ts-ignore
    if (date.getMonth() + 1 < 10) {
        // @ts-ignore
        mouth = '0' + (date.getMonth() + 1);
    } else {
        // @ts-ignore
        mouth = date.getMonth() + 1;
    }
    // @ts-ignore
    if (date.getDate() < 10) {
        // @ts-ignore
        day = '0' + date.getDate();
    } else {
        // @ts-ignore
        day = date.getDate();
    }
    // @ts-ignore
    return date.getFullYear() + '-' + mouth + '-' + day;
};

const filterChange = (value: string) => {
    cleanData();
    const now = new Date();
    const weak = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    const mouth = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
    if (value === 'weak') {
        data.value.filterBy.startDay = formatDate(weak);
        data.value.filterBy.endDay = formatDate(now);
    } else if (value === 'mouth') {
        data.value.filterBy.startDay = formatDate(mouth);
        data.value.filterBy.endDay = formatDate(now);
    } else if (value === 'releaseTime') {
        data.value.filterBy.startDay = '';
        data.value.filterBy.endDay = '';
    }
    getArticleList(data.value).then((res) => {
        articleList.value = res.data.data.data;
    });
};
</script>
<style scoped>
.type {
    opacity: 0.9;
}
.type:hover {
    opacity: 1;
}
</style>
