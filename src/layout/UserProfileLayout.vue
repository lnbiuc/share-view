<template>
    <div class="flex flex-row">
        <div class="w-2/12 mt-2 ml-2">
            <slot name="left" />
        </div>
        <div class="w-10/12">
            <slot name="right" />
        </div>
    </div>
</template>
