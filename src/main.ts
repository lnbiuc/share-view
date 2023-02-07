import { createApp } from "vue";
import "./style.css";
import "tailwindcss/tailwind.css";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";
import 'element-plus/dist/index.css'

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.config.globalProperties.$router = router;
app.mount("#app");
