<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { Ref, ref } from 'vue';
import { ArticleListEntity } from '../../../axios/api/articleApi';
import { getUserCollection } from '../../../axios/api/collectApi';

const userId = useRouteParams<string>('userId');

const params = ref<{ pageNumber: number; pageSize: number; total: number }>({ pageNumber: 1, pageSize: 10, total: 0 });

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

const isLoad = ref<boolean>(false);

const getUserCollect = () => {
    isLoad.value = true;
    getUserCollection(userId.value, params.value.pageNumber, params.value.pageSize).then((res) => {
        articleList.value = res.data.data.data;
        params.value.total = res.data.data.total;
        isLoad.value = false;
    });
};

onMounted(() => {
    getUserCollect();
});

const handleCurrentChange = (pageNumber: number) => {
    params.value.pageNumber = pageNumber;
    getUserCollect();
};
</script>

<template>
    <div>
        <loading :is-loading="isLoad" />
        <all-type-preview-list
            :article-list="articleList"
            :option-type="'Collect'"
            @article-list-update="handleCurrentChange(params.pageNumber)"
        />
        <Pagination
            :current-page="params.pageNumber"
            :page-size="params.pageSize"
            :total="params.total"
            @numberChange="handleCurrentChange"
            :hide-on-single-page="true"
        />
    </div>
</template>
