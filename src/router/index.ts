import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Index",
    component: () => import("../views/Index.vue"),
    meta: { title: "A" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
