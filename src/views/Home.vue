<template>
    <div
        class="text-center m-auto sm:max-w-screen-sm md:max-w-screen-md ls:max-w-screen-md xl:max-w-screen-ls"
    >
        <SortBy
            :sortByList="sortByList"
            :filterByList="filterByList"
            @sortBy="sortChange"
            @filterBy="fitterChange"
        />
        <ArticleList :articleList="articleList" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ArticleList from "../components/index/ArticleList.vue";
import SortBy from "../components/index/nav/SortBy.vue";
import { getArticleList } from "../api/article/articleApi";
const articleList = ref([]);
const data = ref({
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
});
getArticleList(data.value).then((res) => {
    articleList.value = res.data.data.data;
});

const sortByList: Array<{ name: string; value: string }> = [
    {
        name: "Hot",
        value: "hot",
    },
    {
        name: "New",
        value: "new",
    },
    {
        name: "Subscribed",
        value: "subscribed",
    },
];

const filterByList: Array<{ name: string; value: string }> = [
    {
        name: "All Time",
        value: "releastTime",
    },
    {
        name: "This Weak",
        value: "weak",
    },
    {
        name: "This Mouth",
        value: "mouth",
    },
];

const sortChange = (value: string) => {
	console.log(value);
    if (value === "hot") {
        data.value.sortBy.hot = true;
        data.value.sortBy.releaseTime = false;
    } else if (value === "new") {
        data.value.sortBy.hot = false;
        data.value.sortBy.releaseTime = true;
    } else if (value === "subscribed") {
        data.value.sortBy.hot = false;
        data.value.sortBy.releaseTime = false;
		data.value.sortBy.like = true;
    }
    getArticleList(data.value).then((res) => {
        articleList.value = res.data.data.data;
    });
};

const fitterChange = (value: string) => {
    if (value === "weak") {
        data.value.filterBy.startDay = "2021-08-01";
        data.value.filterBy.endDay = "2021-08-31";
    } else if (value === "mouth") {
        data.value.filterBy.startDay = "2021-08-01";
        data.value.filterBy.endDay = "2021-08-31";
    } else if (value === "releastTime") {
        data.value.filterBy.startDay = "";
        data.value.filterBy.endDay = "";
    }
    getArticleList(data.value).then((res) => {
        articleList.value = res.data.data.data;
    });
};
</script>

<style scoped></style>
