<script setup lang="ts">
import { useFilterAndSortStore } from "../../pinia";
import { ArticleListEntity, getArticleList } from "../../api/article/articleApi";
import { ref } from "vue";
const articleList = ref<ArticleListEntity[]>();
// init
const sortStore = useFilterAndSortStore()
const data = ref({
    pageNumber: 1,
    pageSize: 10,
    filterBy: {
        authorId: '',
        categoryId: 0,
        tagId: 0,
        type: 1,
        startDay: '',
        endDay: '',
    },
    sortBy: {
        hot: false,
        releaseTime: true,
    },
});
if (sortStore.sort == 'hot') {
    data.value.sortBy.hot = true
    data.value.sortBy.releaseTime = false
} else if (sortStore.sort == 'new') {
    data.value.sortBy.hot = false
    data.value.sortBy.releaseTime = true
}

getArticleList(data.value).then(res => {
    articleList.value = res.data.data.data;
})
</script>

<template>
    <h1>article card</h1>
</template>

