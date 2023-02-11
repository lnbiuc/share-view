<script setup lang="ts">
import {getOneArticle, ArticleEntity, CommentListEntity, UserEntity} from "../../api/article/articleApi";
import {useRouteParams} from "@vueuse/router";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";

const articleId = useRouteParams<string>('articleId')

const article = ref<ArticleEntity>();
const comments = ref<CommentListEntity>()
const author = ref<UserEntity>()
getOneArticle(articleId.value).then(res => {
	if (res.data.code == 200) {
		article.value = res.data.data.article
		comments.value = res.data.data.comments.data;
		author.value = res.data.data.author
	} else {
		ElMessage.error(res.data.message)
		useRouter().back()
	}
})
</script>

<template>
	<h5>{{ article }}</h5>
	<br/>
	<h5 v-for="c in comments">{{ c }}</h5>
	<br/>
	<h5>{{ author }}</h5>
	<br/>
</template>

