import { createApp } from 'vue';
import "@/assets/tailwind.css";
import Options from "@/pages/options.vue";

const app = createApp(Options);

// 配置忽略以 x- 开头的自定义元素
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('x-');

app.mount('#app');
