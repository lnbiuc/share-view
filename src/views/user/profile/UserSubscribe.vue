<script setup lang="ts">
import { getMySubscribedUser, SubscribedUserEntity } from '../../../axios/api/subscribeApi';
import { useRouteParams } from '@vueuse/router';
import { useUserStore } from '../../../pinia';

const isLoad = ref<boolean>(true);
const params = ref<{ pageNumber: number; pageSize: number; total: number }>({ pageNumber: 1, pageSize: 10, total: 0 });

const userList = ref<SubscribedUserEntity[]>([
    {
        userId: '',
        username: '',
        signature: '',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        level: 0,
        registerTime: '',
        lastLogin: '',
        ipAddr: '',
        isSubscribed: true,
    },
]);

const userId = useRouteParams<string>('userId');

const getSubscribeData = () => {
    isLoad.value = true;
    getMySubscribedUser(params.value.pageNumber, params.value.pageSize, userId.value).then((res) => {
        userList.value = res.data.data.data;
        params.value.total = res.data.data.total;
        isLoad.value = false;
    });
};

onMounted(() => {
    getSubscribeData();
});

const handleCurrentChange = (pageNumber: number) => {
    params.value.pageNumber = pageNumber;
    getSubscribeData();
};

const userStore = useUserStore();
</script>

<template>
    <div class="p-2">
        <loading :is-loading="isLoad" />
        <div v-for="user in userList" class="rounded-md dark:bg-dark bg-light border-light dark:border-dark mb-2 p-4">
            <user-profile :user="user">
                <subscribe-btn
                    v-if="userStore.isLogin && userStore.user.userId === userId"
                    :is-subscribed="user.isSubscribed"
                    :user-id="user.userId"
                    type="user"
                    @update="getSubscribeData"
                />
            </user-profile>
        </div>
        <Pagination
            :current-page="params.pageNumber"
            :page-size="params.pageSize"
            :total="params.total"
            @numberChange="handleCurrentChange"
            :hide-on-single-page="true"
        />
    </div>
</template>
