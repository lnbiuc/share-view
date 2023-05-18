<script setup lang="ts">
import { getCommentByUserId, UserCommentEntity } from '../../../axios/api/commentsApi';
import { ref, Ref } from 'vue';
import { useRouteParams } from '@vueuse/router';

const commentList: Ref<UserCommentEntity[]> = ref([
    {
        commentId: 0,
        toArticleId: '',
        toArticleTitle: '',
        toUser: {
            userId: '',
            username: '',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            ipAddr: '',
        },
        toCommentContent: '',
        content: '',
        level: true,
        createTime: '',
        type: '',
    },
]);

const userId = useRouteParams<string>('userId');

const isLoad = ref<boolean>(true);
const getComment = (pageNumber: number) => {
    isLoad.value = true;
    getCommentByUserId(userId.value, pageNumber, params.value.pageSize).then((res) => {
        commentList.value = res.data.data.data;
        params.value.total = res.data.data.total;
        isLoad.value = false;
    });
};

onMounted(() => {
    getComment(params.value.pageNumber);
});

const params = ref<{ pageNumber: number; pageSize: number; total: number }>({ pageNumber: 1, pageSize: 10, total: 0 });

const handleCurrentChange = (pageNumber: number) => {
    params.value.pageNumber = pageNumber;
    getComment(pageNumber);
};
</script>

<template>
    <div>
        <loading :is-loading="isLoad" />
        <users-comment :comment="commentList" :execute-time="null" />
        <Pagination
            :current-page="params.pageNumber"
            :page-size="params.pageSize"
            :total="params.total"
            @numberChange="handleCurrentChange"
            :hide-on-single-page="true"
        />
    </div>
</template>
