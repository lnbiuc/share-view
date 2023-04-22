<template>
    <transition appear>
        <div
            class="min-h-[100vh] flex flex-row justify-center md:m-auto md:my-2 ls:m-auto ls:my-2 lg:m-auto lg:my-2 sm:m-2 rounded-sm sm:max-w-full md:max-w-full lg:max-w-screen-lg xl:w-[1440px]"
        >
            <div class="w-9/12 mr-2">
                <slot name="left" />
            </div>
            <div class="w-3/12">
                <slot name="right" />
            </div>
        </div>
    </transition>
</template>
<script setup lang="ts"></script>
