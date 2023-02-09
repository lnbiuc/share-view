<template>
	<div class='flex flex-col bg-white mt-2 rounded-md hover:shadow-md shadow-sm p-3'>
		<div class='flex flex-row'>
			<div class='flex flex-1'>
				<img :src='store.user.avatar' alt='' class='w-auto rounded-md shadow-sm hover:shadow-md transition-all'>
			</div>
			<div class='flex flex-1 flex-col mt-20 text-left ml-2'>
				<span class='text-lg'>&nbsp;{{store.user.username}}</span>
				<span class='text-sm m-0.5 ml-1'>Lv:&nbsp;<el-tag style="border: none" class="ml-1">Lv{{ store.user.level }}</el-tag></span>
				<span class='text-sm m-0.5 text-gray-400'>@{{store.user.userId}}</span>
				<span class='text-sm text-gray-400'>&nbsp;Ip from: {{store.user.ipAddr}}</span>
			</div>
		</div>
		<div class='flex flex-row mt-3 ml-1 text-left'>
			Signature:&nbsp;<span>{{store.user.signature}}</span>
		</div>
		<div>

		</div>
	</div>
</template>

<script setup lang='ts'>
import { useUserStore } from '../../pinia';

const store = useUserStore()
</script>