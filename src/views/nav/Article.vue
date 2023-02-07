<template>
    <div class="">
        <ArticleList :articleList="articleList" />
    </div>
</template>

<script setup lang="ts">
import ArticleList from "../../components/index/ArticleList.vue";
import { ref } from "vue";
import { getArticleList } from "../../api/article/articleApi";
const articleList = ref([]);
const data = {
    pageNumber: 1,
    pageSize: 5,
    filterBy: {
        authorId: "",
        categoryId: 0,
        tagId: 0,
        type: 0,
        startDay: "",
        endDay: "",
    },
    sortBy: {
        hot: false,
        lastUpdate: false,
        like: false,
        releaseTime: true,
        views: false,
    },
};
getArticleList(data).then((res) => {
    articleList.value = res.data.data.data;
});
</script>

<style scoped></style>
