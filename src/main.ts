import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index';
import 'element-plus/theme-chalk/el-message.css';
import 'highlight.js/styles/github-dark-dimmed.css';
import { createPinia } from 'pinia';
import './assets/markdown-light.css';
import './assets/markdown-dark.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';

const pinia = createPinia();
const app = createApp(App);

app.use(VueViewer);
app.use(router);
app.use(pinia);
app.config.globalProperties.$router = router;

app.mount('#app');
