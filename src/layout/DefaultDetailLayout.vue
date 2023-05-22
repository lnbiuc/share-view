<template>
    <div
        class="min-h-[100vh] flex flex-row justify-center md:m-auto md:my-2 ls:m-auto ls:my-2 lg:m-auto lg:my-2 sm:m-2 rounded-sm sm:max-w-full md:max-w-full lg:max-w-screen-lg xl:w-[1440px]"
    >
        <div class="w-full mr-2 sm:w-full md:w-9/12 xl:w-9/12 lg:w-9/12">
            <slot name="left" />
        </div>
        <div class="hidden sm:hidden md:block xl:block lg:block w-3/12">
            <slot name="right" />
        </div>
    </div>
</template>
