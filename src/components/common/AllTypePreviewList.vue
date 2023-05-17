<script setup lang="ts">
import { formatTime, handleClickComment, handleToArticleDetail, tagBgColor } from '../../utils';
import {
    ArticleEntity,
    ArticleListEntity,
    deleteArticle,
    getOneArticle,
    hiddenArticle,
} from '../../axios/api/articleApi';
import VideoCardLayout from '../../layout/VideoCardLayout.vue';
import ImageGirdLayout from '../../layout/ImageGirdLayout.vue';
import { PropType, Ref } from 'vue';
import { useDialogControlStore, useUpdateArticleStore, useUserStore } from '../../pinia';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';

const { articleList, viewTime } = defineProps({
    articleList: {
        type: Array as PropType<ArticleListEntity[]>,
        required: true,
    },
    viewTime: {
        type: Array as PropType<string[]>,
        required: false,
    },
});

const emit = defineEmits(['articleListUpdate']);

const userStore = useUserStore();
const refUserStore = storeToRefs(userStore);

const handleDelete = (articleId: string) => {
    deleteArticle(articleId).then((res) => {
        if (res.data.code == 200) {
            ElMessage.success('DELETE');
            emit('articleListUpdate');
        } else {
            ElMessage.error(res.data);
        }
    });
};

const handleHidden = (articleId: string) => {
    hiddenArticle(articleId).then((res) => {
        if (res.data.code == 200) {
            ElMessage.warning(articleId);
            emit('articleListUpdate');
        } else {
            ElMessage.error(res.data);
        }
    });
};

const hiddenModify = (articleId: string) => {
    const updateArticleStore = useUpdateArticleStore();
    getOneArticle(articleId).then((res) => {
        const dialogStore = useDialogControlStore();
        if (res.data.code == 200) {
            const article: Ref<ArticleEntity> = ref(res.data.data.article);
            updateArticleStore.params.id = article.value.articleId;
            updateArticleStore.params.categoryId = article.value.category;
            let tagIds = [];
            for (let tag of article.value.tags) {
                tagIds.push(tag.tagId);
            }
            updateArticleStore.params.tagIds = tagIds;
            updateArticleStore.params.content = article.value.content;
            updateArticleStore.params.title = article.value.title;
            updateArticleStore.params.introduction = article.value.introduction;
            updateArticleStore.enable = true;
            dialogStore.publishArticleForm.status = true;
        } else {
            ElMessage.error(res.data.message);
        }
    });
};
</script>

<template>
    <div
        v-for="(a, index) in articleList"
        :key="a.articleId"
        class="flex flex-col p-5 dark:bg-dark bg-light hover:shadow-md shadow-sm mt-2 mx-2 rounded-md transition-all flex-grow"
    >
        <div class="flex flex-row p-0 justify-between text-gray-400">
            <div class="truncate">
                <span
                    class="hover:text-blue-500 cursor-pointer transition-all"
                    @click="$router.push('/u/p/' + a.author.userId)"
                    >{{ a.author.username }} ·
                </span>
                <span class="text-sm" v-text="formatTime(a.releaseTime)"></span>
                <span class="hover:text-blue-500 cursor-pointer transition-all" v-for="t in a.tags" :key="t.tagId">
                    · {{ t.tagName }}</span
                >
            </div>
            <div>
                <article-option-menu
                    v-if="a.type === 'Article'"
                    :delete-opt="
                        (refUserStore.isLogin && refUserStore.user.value.userId == a.author.userId) ||
                        refUserStore.user.value.permissionLevel >= 3
                    "
                    :hidden-opt="refUserStore.isLogin && refUserStore.user.value.userId == a.author.userId"
                    :modify-opt="refUserStore.isLogin && refUserStore.user.value.userId == a.author.userId"
                    @handleDelete="handleDelete(a.articleId)"
                    @handleHidden="handleHidden(a.articleId)"
                    @handleModify="hiddenModify(a.articleId)"
                />
            </div>
        </div>
        <div class="my-2 flex flex-row items-start">
            <div
                :style="{ backgroundColor: tagBgColor(a.type) }"
                class="mt-0.5 w-[10px] px-2 py-1 text-sm font-medium rounded-md transition-all type cursor-default dark:text-light"
            >
                <span>
                    {{ a.type.substring(0, 1) }}
                </span>
            </div>
            <div
                class="flex flex-grow text-base title leading-7 ml-3"
                @click="handleToArticleDetail(a.type, a.articleId, $router)"
            >
                <span v-if="a.type === 'Article' || a.type === 'Question'">
                    {{ a.title }}
                </span>
                <span v-if="a.type === 'Video' || a.type === 'Post'">
                    {{ a.introduction }}
                </span>
            </div>
        </div>
        <div
            v-if="a.type === 'Article' || a.type === 'Question'"
            class="flex text-xs text-gray-500 text-left cursor-default mb-1"
        >
            {{ a.introduction }}
        </div>
        <div v-if="a.type === 'Video'">
            <video-card-layout :images="a.images[0]" :article-id="a.articleId" />
        </div>
        <div v-if="a.type === 'Post'" class="mt-1">
            <image-gird-layout :images="a.images" />
        </div>
        <div class="flex flex-col mt-2">
            <div class="flex flex-row justify-start">
                <CommentsLink
                    :comments="a.comments"
                    @click="handleClickComment(a.articleId, a.title, a.type, a.introduction, $router)"
                />
                <CollectionLink :id="a.articleId" :type="0" :collect-count="a.collect" />
                <ShareLink />
            </div>
            <div class="mt-4 flex dark:text-dark" v-if="viewTime">
                <span>{{ formatTime(viewTime[index]) }} · {{ viewTime[index] }}</span>
            </div>
        </div>
    </div>
</template>
<style scoped>
.type {
    opacity: 0.9;
}

.type:hover {
    opacity: 1;
}
</style>
