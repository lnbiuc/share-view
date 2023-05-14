<template>
    <div class="flex flex-row">
        <div class="mt-2 ml-2">
            <slot name="left" />
        </div>
        <div class="w-full">
            <slot name="right" />
        </div>
    </div>
</template>
