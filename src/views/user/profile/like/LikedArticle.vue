<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { getLikedArticleByUserId, UserLikeEntity } from '../../../../axios/api/likesApi';
import { Ref, ref } from 'vue';
import { ArticleListEntity, getArticleList } from '../../../../axios/api/articleApi';
import { useArticleParamsStore, useUpdateArticleStore } from '../../../../pinia';
import { storeToRefs } from 'pinia';

const likeList: Ref<UserLikeEntity[]> = ref([
    {
        likeId: 0,
        articleId: '',
        executeTime: '',
        article: {
            articleId: '',
            author: {
                userId: '',
                username: '',
                signature: '',
                avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
                level: 0,
                registerTime: '',
                lastLogin: '',
                ipAddr: '',
                isSubscribed: false,
            },
            title: '',
            introduction: '',
            type: '',
            tags: [],
            category: 0,
            content: '',
            releaseTime: '',
            lastUpdate: '',
            setTop: false,
            views: 0,
            like: 0,
            collect: 0,
            comments: 0,
            images: null,
        },
    },
]);

const articleList: Ref<ArticleListEntity[]> = ref([
    {
        articleId: '',
        author: {
            userId: '',
            username: '',
            signature: '',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            level: 0,
            registerTime: '',
            lastLogin: '',
            ipAddr: '',
            isSubscribed: false,
        },
        title: '',
        introduction: '',
        type: '',
        tags: [],
        category: 0,
        content: '',
        releaseTime: '',
        lastUpdate: '',
        setTop: false,
        views: 0,
        like: 0,
        collect: 0,
        comments: 0,
        images: [],
    },
]);

const timeList = ref<string[]>([]);

const userId = useRouteParams<string>('userId');

const params = ref<{ pageNumber: number; pageSize: number; total: number }>({ pageNumber: 1, pageSize: 10, total: 0 });

const isLoad = ref<boolean>(false);

const getLikedArticle = () => {
    isLoad.value = true;
    getLikedArticleByUserId(userId.value, params.value.pageNumber, params.value.pageSize).then((res) => {
        likeList.value = res.data.data.data;
        params.value.total = res.data.data.total;
        articleList.value = likeList.value.map((item) => item.article);
        timeList.value = likeList.value.map((item) => item.executeTime);
        isLoad.value = false;
    });
};

onMounted(() => {
    getLikedArticle();
});

const handleCurrentChange = (pageNumber: number) => {
    params.value.pageNumber = pageNumber;
    getLikedArticle();
};
</script>

<template>
    <div>
        <loading :is-loading="isLoad" />
        <all-type-preview-list :article-list="articleList" :view-time="timeList" />
        <Pagination
            :current-page="params.pageNumber"
            :page-size="params.pageSize"
            :total="params.total"
            @numberChange="handleCurrentChange"
            :hide-on-single-page="true"
        />
    </div>
</template>
