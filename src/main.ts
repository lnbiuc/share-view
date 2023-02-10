import { createApp } from 'vue';
import './style.css';
import 'tailwindcss/tailwind.css';
import App from './App.vue';
import router from './router/index';
import 'element-plus/theme-chalk/el-message.css';
import { createPinia } from 'pinia';
const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.config.globalProperties.$router = router;

app.mount('#app');
