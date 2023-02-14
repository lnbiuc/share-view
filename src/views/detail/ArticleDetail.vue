<script setup lang="ts">
import {
	getOneArticle,
	ArticleContentEntity
} from '../../api/article/articleApi';
// @ts-ignore
import { StarFilled, CaretTop, CaretBottom } from '@element-plus/icons-vue';

import { useRouteParams } from '@vueuse/router';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const articleId = useRouteParams<string>('articleId');
const data = ref<ArticleContentEntity>({
	"article":{
		"articleId":"hSUd8f",
		// @ts-ignore
		"author":{
			"userId":"978SdfDS",
			"username":"lnbiuc",
			"signature":"wsssd",
			"avatar":"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
			"level":2,
			"registerTime":"2023-01-28 13:32:26",
			"lastLogin":"2023-02-13 16:08:47",
			"ipAddr":"内网IP"
		},
		"title":"Article_title3-test",
		"introduction":"Article_introduction3-test",
		"type":"Article",
		"tags":[
			{
				"tagId":2007,
				"tagName":"Tags-7"
			},
		],
		"category":"C_4-test",
		"content":"Article_content3-test",
		"releaseTime":"2024-01-28 17:36:09",
		"lastUpdate":"2023-01-28 20:36:10",
		"setTop":false,
		"views":66,
		"like":0,
		"comments":0
	},
	"comments":{
		"pageNumber":1,
		"pageSize":0,
		"currentSize":0,
		"total":0,
		"data":[

		]
	},
	"author":{
		"userId":"978SdfDS",
		"username":"lnbiuc",
		"signature":"wsssd",
		"avatar":"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
		"level":2,
		"registerTime":"2023-01-28 13:32:26",
		"lastLogin":"2023-02-14 19:55:01",
		"ipAddr":"内网IP"
	}
})

onMounted(() => {
	getOneArticle(articleId.value).then((res) => {
		if (res.data.code == 200) {
			data.value = res.data.data;
			ElMessage.success(res.data.message);
		} else {
			ElMessage.error(res.data.message);
			useRouter().back();
		}
	});
})
</script>

<template>
    <div class="article flex flex-row text-center justify-center m-auto rounded-sm my-2 p-2 sm:max-w-full md:max-w-full ls:max-w-screen-ls lg:max-w-screen-lg">
        <div class="ls:flex lg:flex md:flex sm:hidden justify-center w-1/12 relative items-center">
			<div class="fixed top-1/4">
				<div class="flex flex-col">
					<el-icon class="p-0.5 my-2 cursor-pointer bg-gray-200 rounded-full hover:bg-gray-300 transition-all" size="40px" color="gray"><CaretTop /></el-icon>
					<el-icon class="p-0.5 my-2 cursor-pointer bg-gray-200 rounded-full hover:bg-gray-300 transition-all" size="40px" color="gray"><CaretBottom /></el-icon>
					<el-icon class="p-0.5 my-2 cursor-pointer bg-gray-200 rounded-full hover:bg-gray-300 transition-all" size="40px" color="gray"><StarFilled /></el-icon>&nbsp;
				</div>
			</div>
        </div>
        <div class="flex flex-col ls:w-8/12 lg:w-9/12 md:w-10/12 sm:w-full p-4 text-left rounded-md bg-white rounded-md">
            <div class="flex flex-col">
                <div class="flex flex-col">
                    <span class="text-4xl pt-4 pb-2">{{ data.article.title }}</span>
                    <span class="text-gray-500 mt-2">{{ data.article.introduction }}</span>
                </div>
				<div class="flex flex-row justify-between px-2">
					<div class="flex flex-row mt-4">
						<div>
							<el-avatar :size="60" :src="data.author.avatar"/>
						</div>
						<div class="flex flex-col ml-4 justify-around">
							<div class="flex flex-row items-center">
								<div class="flex">
									<span class="text-lg text-gray-800">{{ data.author.username }}</span>
									<span class="text-sm text-gray-400 flex items-center mt-1">&nbsp;@{{ data.author.userId }}</span>
									<span class="mx-2">&nbsp;<el-tag>Lv {{ data.author.level }}</el-tag></span>
								</div>
							</div>
							<div>
								<span class="text-sm text-gray-400">{{ data.article.releaseTime }}</span>
								<span class="text-sm text-gray-400">&nbsp;&nbsp;IP: {{ data.author.ipAddr }}</span>
							</div>
						</div>
					</div>
					<div class="flex items-center mb-4">
						<el-button>Subscribe</el-button>
					</div>
				</div>
				<el-divider>CONTENT</el-divider>
                <div>
                    {{ data.article.content }}
                </div>
				<el-divider >END</el-divider>
            </div>
<!--			comment-->
            <div class="flex flex-col">
                comment
            </div>
        </div>
        <div class="flex ls:flex lg:flex md:hidden sm:hidden flex-col ml-2 rounded-md bg-purple-100 shadow-md w-3/12">
            <div>
<!--                <UserInfo />-->
            </div>
            <div>
                toc
            </div>
        </div>
    </div>
</template>
<style scoped>
.article {
	min-height: 170vh;
}
</style>
