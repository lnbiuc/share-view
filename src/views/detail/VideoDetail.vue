<script setup lang="ts">

</script>

<template>
    <div class="flex flex-col justify-center items-center">
		<div class="flex mt-8">
			<video-player
				src="https://share-1308549476.cos.ap-shanghai.myqcloud.com/video/40931678807694021.mp4"
				poster="https://vio.vin/card.png"
				:controls="true"
				:loop="true"
				:volume="0.5"
			/>
		</div>
	</div>
</template>
