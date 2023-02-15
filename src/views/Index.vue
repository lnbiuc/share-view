<template>
    <div class="flex flex-col">
        <Header />
        <div class="mainContainer">
            <RouterView />
        </div>
        <Footer />
        <el-backtop :right="100" :bottom="100" />
    </div>
</template>

<script setup lang="ts">
import Header from '../components/index/nav/Header.vue';
import Footer from '../components/index/nav/Footer.vue';
</script>

<style scoped>
.mainContainer {
    width: 1440px;
    margin: 0 auto;
    min-height: calc(100vh - 128px);
}
</style>
