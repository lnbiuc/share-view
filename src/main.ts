import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index';
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-notification.css';
import 'highlight.js/styles/github-dark-dimmed.css';
import { createPinia } from 'pinia';
import './assets/markdown-light.css';
import './assets/markdown-dark.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';
// @ts-ignore
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
// @ts-ignore
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// @ts-ignore
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import Prism from 'prismjs';
// @ts-ignore
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';
import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css';
// @ts-ignore
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';
// @ts-ignore
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
// @ts-ignore
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index';
import '@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css';
// @ts-ignore
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

VueMarkdownEditor.use(vuepressTheme, {
    Prism,
    codeHighlightExtensionMap: {
        vue: 'html',
    },
    extend(md: any) {},
});

VueMarkdownEditor.use(createEmojiPlugin());
VueMarkdownEditor.use(createKatexPlugin());
VueMarkdownEditor.use(createTodoListPlugin());
VueMarkdownEditor.use(createLineNumbertPlugin());
VueMarkdownEditor.use(createHighlightLinesPlugin());
VueMarkdownEditor.use(createCopyCodePlugin());
const pinia = createPinia();
const app = createApp(App);

app.use(VueViewer);
app.use(router);
app.use(pinia);
app.use(VueMarkdownEditor);
app.config.globalProperties.$router = router;

app.mount('#app');
