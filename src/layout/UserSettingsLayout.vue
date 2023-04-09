<template>
    <div class="min-h-[100vh] flex flex-row m-2 p-2 rounded-md border-dark dark:bg-dark">
        <div class="w-3/12">
            <slot name="left" />
        </div>
        <div class="w-9/12">
            <slot name="right" />
        </div>
    </div>
</template>