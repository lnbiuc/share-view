<template>
    <div class="flex flex-col">
        <Header />
        <div class="mainContainer sm:max-w-screen-sm md:max-w-screen-md ls:max-w-screen-ls lg:max-w-4xl">
            <RouterView />
        </div>
        <Footer />
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
