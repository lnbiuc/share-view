<template>
  <div class=" bg-slate-50">
    <div class="m-0 p-0">
      <Header />
    </div>
    <div class="list m-auto text-center mt-4">
      <ArticleList :articleList="articleList" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "../components/index/Header.vue";
import ArticleList from "../components/index/ArticleList.vue";
import { ref } from "vue";
import { getArticleList } from "../api/article/articleApi";
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

<style scoped>
.list {
  width: 700px;
}
</style>
