<template>
    <transition appear>
        <div
            class="min-h-[100vh] flex flex-row justify-center md:m-auto ls:m-auto lg:m-auto rounded-sm sm:max-w-full md:max-w-full lg:max-w-screen-lg xl:w-[1440px]"
        >
            <div class="w-9/12">
                <slot name="left" />
            </div>
            <div class="w-3/12 mt-2">
                <slot name="right" />
            </div>
        </div>
    </transition>
</template>
<script setup lang="ts"></script>
