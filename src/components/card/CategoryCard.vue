<script setup lang="ts">
import { CategoryEntity, getCategoryList } from "../../api/category/categoryApi";

const data = ref<CategoryEntity[]>([{
    "id":3005,
    "name":"Others",
    // @ts-ignore
    "author":{
        "userId":"GU89dH56",
        "username":"user2",
        "signature":"Arcade cabinets retro Melon dots maza Pac-Man chase red Namco fruit wocka paku-paku 1980",
        "avatar":"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        "level":3,
        "ipAddr":"西安"
    },
    "introduction":"Others",
    "avatar":"https://user-pic-1308549476.cos.ap-nanjing.myqcloud.com/pic/41541676523794720.png",
    "createTime":"2023-01-28 10:15:27"
}])
getCategoryList(1, 10).then(res => {
    data.value = res.data.data
})
</script>

<template>
    <div class="m-2">
        <div v-for="a in data" :key="a.id" class="flex flex-col mb-2 bg-white transition-all dark:bg-dark rounded-md shadow-sm hover:shadow-md p-4">
            <div class="flex flex-col">
                <el-avatar :size="100" shape="square" :src="a.avatar"/>
                <el-button>Subscribe</el-button>
            </div>
            <div class="flex flex-col">
                <span>{{a.name}}</span>
            </div>
        </div>
    </div>
</template>

