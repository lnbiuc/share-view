<template>
    <div class="flex flex-col">
        <Header />
        	<RouterView />
        <Footer />
    </div>
</template>

<script setup lang="ts">
import Header from "../components/index/Header.vue";
import { ref } from "vue";
</script>

<style scoped>
.list {
    width: 700px;
}
</style>
