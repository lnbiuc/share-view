<script setup lang="ts">
import {ArticleEntity} from "../../api/article/articleApi";

const prop = defineProps({
    articleList: {
		type: Array<ArticleEntity>
	}
})
</script>
<template>
    <div class="flex flex-col bg-white mt-2 rounded-md hover:shadow-md transition-all shadow-sm p-3">
        <div v-for="a in articleList">
            {{a.articleId}}
        </div>
    </div>
</template>

