<template>
    <div
        class="min-h-[100vh] flex flex-col justify-center md:m-auto md:my-2 ls:m-auto ls:my-2 lg:m-auto lg:my-2 sm:m-2 rounded-sm sm:max-w-full md:max-w-full lg:max-w-screen-lg xl:w-[1440px]"
    >
        <div class="my-4 w-full">
            <slot name="header" />
        </div>
        <div class="mb-2 w-full">
            <slot name="video" />
        </div>
        <div class="mb-2 w-full">
            <slot name="author" />
        </div>
        <div class="w-full">
            <slot name="comment" />
        </div>
    </div>
</template>
