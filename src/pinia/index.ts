import { defineStore } from "pinia";

export const useStore = defineStore("count", {
    state: () => ({
        count: 0,
    }),
});
