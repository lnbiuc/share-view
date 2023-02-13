<script setup lang="ts">
import { getOneArticle, ArticleEntity, CommentListEntity, UserEntity } from '../../api/article/articleApi';
import { useRouteParams } from '@vueuse/router';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const articleId = useRouteParams<string>('articleId');
const author = ref<UserEntity>({
    userId:"978SdfDS",
    username:"lnbiuc",
    phone:"17743931264",
    mail:"13251@432.com",
    signature:"wsssd",
    avatar:"null",
    level:2,
    isBlock:false,
    permissionLevel:2,
    registerTime:"2023-01-28 13:32:26",
    isMailNotice:true,
    isPhoneNotice:true,
    theme:"null",
    lastLogin:"2023-01-28 13:32:32",
    loginIp:"127.0.0.1",
    ipAddr:"null"
});
const article = ref<ArticleEntity>({
    articleId:"NpS4Dt",
    author: author.value,
    title:"Article_title3-test",
    introduction:"Article_introduction3-test",
    type:"Article",
    tags:[
        {
            tagId:2001,
            tagName:"Tags-1"
        },
        {
            tagId:2002,
            tagName:"Tags-2"
        },
        {
            tagId:2003,
            tagName:"Tags-3"
        },
        {
            tagId:2010,
            tagName:"Tags-10"
        },
        {
            tagId:2010,
            tagName:"Tags-10"
        }
    ],
    category:"C_4-test",
    releaseTime:"2024-01-28 17:36:09",
    lastUpdate:"2023-01-28 20:36:10",
    setTop:false,
    views:48,
    like:10,
    comments:6
});
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
                article
            </div>
            <div class="flex flex-col">
                comment
            </div>
        </div>
        <div class="flex flex-col">
            <div>
                user info
            </div>
            <div>
                toc
            </div>
        </div>
    </div>
</template>
