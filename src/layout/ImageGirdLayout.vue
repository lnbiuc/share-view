<script setup lang="ts">
const { images } = defineProps<{
    images: string[];
}>();
const { proxy }: any = getCurrentInstance();
const showImages = (img: string[], index: number) => {
    if (!index) {
        index = 0;
    }
    proxy.$viewerApi({
        images: img,
        options: {
            initialViewIndex: index,
        },
    });
};
</script>

<template>
    <div class="flex flex-row flex-wrap justify-center items-center">
        <div v-if="images.length > 0" class="w-full">
            <div v-if="images.length === 1" class="grid grid-cols-1 grid-rows-1 gap-2">
                <div
                    @click="showImages(images, 0)"
                    :style="{
                        backgroundImage: 'url(' + images[0] + ')',
                        background: 'center center / no-repeat',
                    }"
                    class="bg-cover bg-center h-[350px] w-full rounded shadow-sm"
                ></div>
            </div>
            <div v-if="images.length === 2" class="grid grid-cols-2 grid-rows-1 gap-2">
                <div
                    v-for="(image, index) in images"
                    @click="showImages(images, index)"
                    :style="{
                        backgroundImage: 'url(' + image + ')',
                        background: 'center center / no-repeat',
                    }"
                    class="bg-cover bg-center h-[250px] w-full rounded shadow-sm"
                ></div>
            </div>
            <div v-if="images.length <= 4 && images.length >= 3" class="grid grid-cols-2 grid-rows-2 gap-2">
                <div
                    v-for="(image, index) in images"
                    @click="showImages(images, index)"
                    :style="{
                        backgroundImage: 'url(' + image + ')',
                        background: 'center center / no-repeat',
                    }"
                    class="bg-cover bg-center h-[200px] w-full rounded shadow-sm"
                ></div>
            </div>
            <div v-if="images.length >= 5 && images.length <= 6" class="grid grid-cols-3 grid-rows-2 gap-2">
                <div
                    v-for="(image, index) in images"
                    @click="showImages(images, index)"
                    :style="{
                        backgroundImage: 'url(' + image + ')',
                        background: 'center center / no-repeat',
                    }"
                    class="bg-cover bg-center h-[200px] w-full rounded shadow-sm"
                ></div>
            </div>
            <div v-if="images.length >= 6" class="grid grid-cols-3 grid-rows-3 gap-2">
                <div
                    v-for="(image, index) in images"
                    @click="showImages(images, index)"
                    :style="{
                        backgroundImage: 'url(' + image + ')',
                        background: 'center center / no-repeat',
                    }"
                    class="bg-cover bg-center h-[200px] w-full rounded shadow-sm"
                ></div>
            </div>
        </div>
    </div>
</template>
