<template>
  <div class="mt-5">
    <div
      v-for="a in articleList"
      :key="a.articleId"
      class="flex flex-col p-5 bg-white hover:shadow-md m-2 rounded-md transition-all"
    >
      <div class="flex flex-row text-gray-400">
        <p class="truncate">
          <span
            >{{ a.author.username }} ·
            <span v-text="formatTime(a.releaseTime)"></span>
          </span>
          <span v-for="t in a.tags" :key="t.tagId"> · {{ t.tagName }}</span>
        </p>
      </div>
      <div class="flex flex-row m">
          <div class="my-2 flex flex-row align-middle">
            <div
              class="mr-2 rounded-full m-auto"
              :style="{ backgroundColor: tagBgColor(a.type)}"
              style="width: 80px"
            >
              {{ a.type }}
            </div>
            <div class="text-lg">{{ a.title }}</div>
        </div>
      </div>
      <div class="flex mb-4 text-gray-500 truncate">
        {{ a.introduction }}
      </div>
      <div class="flex flex-row">
        <div class="flex">
          <div class="flex flex-row bg-purple-200 rounded-md text-purple-900 p-0.5 px-2 mr-1">
            <img src="../../assets/icon/arrows_up_full..svg" class="w-4 h-4 m-auto" alt="" />&nbsp;
            <span>Like {{ a.like }}</span>
          </div>
          <div class="flex bg-purple-200 rounded-md text-purple-900 p-0.5 px-2">
            <img src="../../assets/icon/arrows_down_full..svg" class="w-4 h-4 m-auto text-center" alt="" />
          </div>
          <span>

          </span>
        </div>
        <!-- <div>
          {{ a.views }}
        </div>
        <div>
          {{ a.comments }}
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { format } from "timeago.js";
const props = defineProps({
  articleList: {
    type: Object,
    default: {},
  },
});
const formatTime = (time: string) => {
  return format(time, "zh_CN");
};
const tagBgColor = (type: string) => {
  switch (type) {
    case "Post":
      return "#eebe77";
    case "Question":
      return "#95d475";
    case "Article":
      return "#79bbff";
  }
};
</script>

<style scoped></style>
