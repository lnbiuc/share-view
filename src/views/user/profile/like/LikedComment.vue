<script setup lang="ts">
import { getLikedCommentByUserId, LikedCommentEntity } from '../../../../axios/api/likesApi';
import { useRouteParams } from '@vueuse/router';
import { Ref, ref } from 'vue';
import { UserCommentEntity } from '../../../../axios/api/commentsApi';

const likedCommentList: Ref<LikedCommentEntity[]> = ref([
    {
        likeId: 0,
        commentId: 0,
        executeTime: '',
        comment: {
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
            level: false,
            createTime: '',
        },
    },
]);

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
    },
]);

const timeList = ref<string[]>([]);

const userId = useRouteParams<string>('userId');

const params = ref<{ pageNumber: number; pageSize: number; total: number }>({ pageNumber: 1, pageSize: 10, total: 0 });

const isLoad = ref<boolean>(false);

const getLikedComment = () => {
    isLoad.value = true;
    getLikedCommentByUserId(userId.value, params.value.pageNumber, params.value.pageSize).then((res) => {
        likedCommentList.value = res.data.data.data;
        params.value.total = res.data.data.total;
        commentList.value = [];
        timeList.value = [];
        likedCommentList.value.forEach((item) => {
            commentList.value.push(item.comment);
            timeList.value.push(item.executeTime);
        });
        isLoad.value = false;
    });
};

onMounted(() => {
    getLikedComment();
});

const handleCurrentChange = (pageNumber: number) => {
    params.value.pageNumber = pageNumber;
    getLikedComment();
};
</script>

<template>
    <div>
        <loading :is-loading="isLoad" />
        <users-comment :comment="commentList" :execute-time="timeList" />
        <Pagination
            :current-page="params.pageNumber"
            :page-size="params.pageSize"
            :total="params.total"
            @numberChange="handleCurrentChange"
            :hide-on-single-page="true"
        />
    </div>
</template>
