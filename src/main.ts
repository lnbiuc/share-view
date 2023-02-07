import { createApp } from "vue";
import "./style.css";
import "tailwindcss/tailwind.css";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const pinia = createPinia();

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.use(router);
app.use(pinia);
app.config.globalProperties.$router = router;
app.mount("#app");
