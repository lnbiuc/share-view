import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index';
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-notification.css';
import { createPinia } from 'pinia';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';
import 'md-editor-v3/lib/style.css';
const pinia = createPinia();
const app = createApp(App);
// https://github.com/surmon-china/videojs-player#usage-vue
import VueVideoPlayer from '@videojs-player/vue';
import 'video.js/dist/video-js.css';

app.use(VueViewer);
app.use(router);
app.use(pinia);
app.use(VueVideoPlayer);

app.config.globalProperties.$router = router;

app.mount('#app');
