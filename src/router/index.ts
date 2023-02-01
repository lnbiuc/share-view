import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Index",
    component: () => import("../views/Index.vue"),
    meta: { title: "Index" },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: { title: "Login" },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
