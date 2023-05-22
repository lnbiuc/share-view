<template>
    <div
        class="min-h-[100vh] flex flex-col mt-2 md:m-auto md:my-2 ls:m-auto ls:my-2 lg:m-auto lg:my-2 sm:m-2 rounded-sm sm:max-w-full md:max-w-full lg:max-w-screen-lg xl:w-[1440px]"
    >
        <div class="flex flex-row border-light dark:border-dark dark:bg-dark p-4 mx-2 rounded-md">
            <div>
                <slot name="avatar" />
            </div>
            <div class="flex flex-col flex-grow justify-end mx-4 mb-2">
                <slot name="userInfo" />
            </div>
        </div>
        <div>
            <slot name="other" />
        </div>
    </div>
</template>
