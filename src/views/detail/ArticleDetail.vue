<script setup lang="ts">
import {
	getOneArticle,
	ArticleContentEntity
} from '../../api/article/articleApi';
// @ts-ignore
import { StarFilled, CaretTop, CaretBottom } from '@element-plus/icons-vue';
// @ts-ignore
import Markdown from 'vue3-markdown-it';
import { useRouteParams } from '@vueuse/router';
import { ElMessage } from 'element-plus';
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useThemeStore } from "../../pinia";
import { storeToRefs } from "pinia";
import { renderToc } from "../../utils";

const articleId = useRouteParams<string>('articleId');
const data = ref<ArticleContentEntity>({
	"article":{
		"articleId":"loading~~",
		// @ts-ignore
		"author":{
			"userId":"loading~~",
			"username":"loading~~",
			"signature":"loading~~",
			"avatar":"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
			"level":0,
			"registerTime":"loading~~",
			"lastLogin":"loading~~",
			"ipAddr":"loading~~"
		},
		"title":"loading~~",
		"introduction":"loading~~",
		"type":"Article",
		"tags":[],
		"category":"loading~~",
		"content":"loading~~",
		"releaseTime":"loading~~",
		"lastUpdate":"loading~~",
		"setTop":false,
		"views":0,
		"like":0,
		"comments":0
	},
	"comments":{
		"pageNumber":1,
		"pageSize":0,
		"currentSize":0,
		"total":0,
		"data":[]
	},
	"author":{
		"userId":"loading~~",
		"username":"loading~~",
		"signature":"loading~~",
		"avatar":"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
		"level":0,
		"registerTime":"loading~~",
		"lastLogin":"loading~~",
		"ipAddr":"loading~~"
	}
})

onMounted(() => {
	getOneArticle(articleId.value).then((res) => {
		if (res.data.code == 200) {
			data.value = res.data.data;
            nextTick(() => {
                renderToc();
                window.scroll({ top: 0, behavior: 'smooth' })
            })
		} else {
			ElMessage.error(res.data.message);
			useRouter().back();
		}
	});
})
onBeforeRouteLeave(() => {
    // @ts-ignore
    tocbot.destroy();
});
onBeforeUnmount(() => {
    // @ts-ignore
    tocbot.destroy();
});
const themeStore = storeToRefs(useThemeStore());
watch(themeStore.isDark, async () => {
    const el = document.getElementById('markdown')
    if (themeStore.isDark.value) {
        // @ts-ignore
        el.removeAttribute("class");
        // @ts-ignore
        el.classList.add('markdown-body-dark')
    } else {
        // @ts-ignore
        el.removeAttribute("class");
        // @ts-ignore
        el.classList.add('markdown-body-light')
    }
});
</script>

<template>
    <div class="article flex flex-row text-center justify-center m-auto rounded-sm mb-2 py-2 sm:max-w-full md:max-w-full ls:max-w-screen-ls lg:max-w-screen-lg">
        <div class="ls:flex lg:flex md:flex sm:hidden justify-center w-1/12 relative items-center">
			<div class="fixed top-1/4">
				<div class="flex flex-col">
					<el-icon class="p-0.5 my-2 cursor-pointer bg-gray-200 rounded-full hover:bg-gray-300 transition-all" size="40px" color="gray"><CaretTop /></el-icon>
					<el-icon class="p-0.5 my-2 cursor-pointer bg-gray-200 rounded-full hover:bg-gray-300 transition-all" size="40px" color="gray"><CaretBottom /></el-icon>
					<el-icon class="p-0.5 my-2 cursor-pointer bg-gray-200 rounded-full hover:bg-gray-300 transition-all" size="40px" color="gray"><StarFilled /></el-icon>&nbsp;
				</div>
			</div>
        </div>
        <div class="flex flex-col ls:w-8/12 lg:w-9/12 md:w-10/12 sm:w-full p-4 text-left rounded-md bg-white shadow-sm">
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
                    <Markdown id="markdown" class="markdown-body-light" :source="data.article.content"/>
                </div>
				<el-divider >END</el-divider>
            </div>
        </div>
        <div class="flex ls:flex lg:flex md:hidden sm:hidden flex-col ml-2 w-3/12">
            <el-affix :offset="10">
                <div class="js-toc text-left text-md no-underline transition-all bg-white rounded-md shadow-sm px-4 py-2 overflow-auto break-all	">
                </div>
            </el-affix>
        </div>
    </div>
</template>
<style scoped>
.article {
	min-height: 170vh;
}

</style>
<style>
.toc-link {
    text-decoration: none !important;
}

.toc-list {
    padding-left: 20px !important;
}

.toc-link::before {
    background-color: unset;
}

.is-active-link::before {
    background-color: unset;
}
</style>