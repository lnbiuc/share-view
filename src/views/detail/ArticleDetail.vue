<script setup lang="ts">
import { getOneArticle, ArticleEntity, CommentListEntity, UserEntity } from '../../api/article/articleApi';
import { useRouteParams } from '@vueuse/router';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const articleId = useRouteParams<string>('articleId');
const author = ref<UserEntity>();
const article = ref<ArticleEntity>();
const comments = ref<CommentListEntity>();

getOneArticle(articleId.value).then((res) => {
    if (res.data.code == 200) {
        article.value = res.data.data.article;
        comments.value = res.data.data.comments.data;
        author.value = res.data.data.author;
    } else {
        ElMessage.error(res.data.message);
        useRouter().back();
    }
});
</script>

<template>
    <div class="flex flex-row rounded-sm hover:shadow-md transition-all">
        <div>
            left slider
        </div>
        <div class="flex flex-col rounded-sm hover:shadow-md bg-purple-200 sm:max-w-screen-sm md:max-w-screen-md ls:max-w-screen-ls lg:max-w-4xl">
            <div class="flex flex-col">
                <div>
                    <span>{{ article.title }}</span>
                    <span>{{ article.introduction }}</span>
                </div>
                <div>
                    <div>
                        <el-avatar size="large" :src="article.author.avatar"/>
                    </div>
                    <div>
                        <div>
                            <span>{{ article.author.username }}</span>
                            <span>@{{ article.author.userId }}</span>
                            <span>{{ article.author.level }}</span>
                            <div>
                                <el-button>Subscribe</el-button>
                            </div>
                        </div>
                        <div>
                            <span>{{ article.releaseTime }}</span>
                            <span>{{ article.author.ipAddr }}</span>
                        </div>
                    </div>
                </div>
                <div>
                    {{ article.content }}
                </div>
            </div>
            <div class="flex flex-col">
                comment
            </div>
        </div>
        <div class="flex flex-col">
            <div>
                <UserInfo />
            </div>
            <div>
                toc
            </div>
        </div>
    </div>
</template>
