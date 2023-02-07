<template>
    <div class="flex flex-col">
        <Header />
		<div class="mainContainer">
			<RouterView />
		</div>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import Header from "../components/index/nav/Header.vue";
import Footer from "../components/index/nav/Footer.vue";
</script>

<style scoped>
.mainContainer {
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	min-height: calc(100vh - 128px);
}
</style>
