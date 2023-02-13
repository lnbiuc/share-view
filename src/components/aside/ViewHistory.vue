<script setup lang="ts">
import { ArticleListEntity } from '../../api/article/articleApi';
import { formatTime } from "../../utils";
// @ts-ignore
import { User } from "@element-plus/icons-vue";

const prop = defineProps({
    articleList: {
        type: Array<ArticleListEntity>,
    },
});

</script>
<template>
    <div class="flex flex-col bg-white mt-2 rounded-md hover:shadow-md transition-all shadow-sm p-3">
        <div v-for="a in articleList" class="hover:border-b-2 border-b-white border-b-2 p-2 hover:shadow-md rounded-md transition-all">
            <div class="flex flex-row justify-start">
                <span class=" hover:text-blue-500 text-gray-600 transition-all cursor-pointer" @click="$router.push({ path: '/a/' + a.articleId })">{{a.title}}</span>
            </div>
            <div class="flex flex-row justify-start text-md text-gray-400">
                <span>{{a.introduction}}</span>
            </div>
            <div class="flex flex-row justify-between text-sm text-gray-400">
                <span class="hover:text-blue-400 transition-all cursor-pointer"><el-icon><User /></el-icon> {{a.author.username}}</span>
                <!--                TODO change to add time-->
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="a.lastUpdate"
                    placement="bottom-end"
                >
                    <span class="cursor-pointer" v-text="formatTime(a.lastUpdate)"></span>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>
