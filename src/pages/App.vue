<script lang="ts" setup>
import { useOptionsStore } from "./use-options-store";
import { onMessage } from "@/utils/message";
import MessageTip from "@/components/MessageTip.vue";
import PostList from "./post-list/PostList.vue";
import ActionBar from "./action-bar/ActionBar.vue";
import {
  FontSize,
  paddingMap,
  postFontSizeMap,
  TitleFontSize,
  titleFontSizeMap,
  widthMap,
  WidthSize,
} from "@/utils/post-config";
import Card from "./Card.vue";
import { currentIdStorage } from "@/utils/storage";
import { onMounted, watch, onUnmounted } from "vue";

const { todos, getTodos, currentTodoId, currentTodo, config, bgClass, onlyEditorVisible, isDownloading, isCopying } =
  useOptionsStore();

 

const detailCss = (newVal: typeof config.value) => {
  const card = document.querySelectorAll("#card");
  if (card) {
    card.forEach((card) => {
      if (card instanceof HTMLElement) {
        card.style.width = widthMap[newVal.width as WidthSize];
        card.style.fontSize = postFontSizeMap[newVal.fontSize as FontSize];
        if (card.className.includes('bg-')) {
          card.className = card.className.replace(/bg-[^ ]+/, `bg-${newVal.color}`);
        } else {
          card.className = card.className + ` bg-${newVal.color}`;
        }
        card.style.padding = paddingMap[newVal.padding as keyof typeof paddingMap];
      }
    });
  }
  const comments = document.querySelectorAll("#comment");
  comments.forEach((comment) => {
    if (comment instanceof HTMLElement) {
      comment.style.fontSize = postFontSizeMap[newVal.fontSize as FontSize];
    }
  });
  const title = document.getElementById("title");
  if (title) {
    title.style.fontSize = titleFontSizeMap[newVal.fontSize as TitleFontSize];
  }

  // 应用自定义CSS
  const styleId = 'custom-card-style';
  let styleEl = document.getElementById(styleId);
  
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  // 更新自定义样式内容
  styleEl.textContent = newVal.customCSS || '';
};
watch(
  config,
  (newVal) => {
    detailCss(newVal);
  },
  { deep: true, immediate: true },
);

const updateCurrentId = async () => {
  const id = await currentIdStorage.getValue();
  if (id) {
    currentTodoId.value = id;
    await getTodos();
  }
};

// 处理标签页激活
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
     updateCurrentId();
  }
};

onMounted(async () => {
  await updateCurrentId();
  await getTodos();
  detailCss(config.value);
  
  // 添加 visibilitychange 监听
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
  // 清理监听器
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});

// storage.watch<number>('local:currentId', (newCount, oldCount) => {
//   console.log('Count changed:', { newCount, oldCount });
// });
</script>

<template>
  <MessageTip /> 
  <div class="flex bg-pattern px-[100px] h-full ">
    <div class="sticky top-2 mr-4">
      <PostList />
    </div> 
    <div class="card-container mx-auto m-4 block">
      <Card />
     </div>
    <div class="sticky top-2 ml-4 min-h-screen ">
      <ActionBar />
    </div>
  </div>
</template>
<style>
.drop {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
}

/* 添加样式控制复制时的高度 */
#card {
  height: fit-content;
  max-height: 100%;
}

.bg-default {
  background: linear-gradient(to right, #ff8008, #ffc837);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.bg-a {
  background: linear-gradient(to right, #cc2b5e, #753a88);
}

.bg-b {
  background: linear-gradient(to right, #2193b0, #6dd5ed);
}

.bg-c {
  background: linear-gradient(to right, #00416a, #e4e5e6);
}

.bg-d {
  background: linear-gradient(to top, #ffe259, #ffa751);
}

.bg-e {
  background: linear-gradient(to top, #799f0c, #acbb78);
}

.bg-f {
  background: linear-gradient(to top, #5433ff, #20bdff, #a5fecb);
}

.bg-g {
  background: linear-gradient(to top, #0052d4, #4364f7, #6fb1fc);
}

.bg-h {
  background: linear-gradient(to top, #00416a, #799f0c, #ffe000);
}

.bg-i {
  background: linear-gradient(to top, #bdc3c7, #2c3e50);
}

.bg-j {
  background: linear-gradient(to top, #ee9ca7, #ffdde1);
}

.bg-k {
  background: linear-gradient(to top, #c6ffdd, #fbd786, #f7797d);
}

.bg-l {
  background: linear-gradient(to top, #12c2e9, #c471ed, #f64f59);
}

.bg-m {
  background: linear-gradient(to right, #b92b27, #1565c0);
}

/* Start of Selection */
.bg-n {
  background: #E68A00;
  /* 深橙色 */
}

.bg-o {
  background: #2E8B57;
  /* 深海绿 */
}

.bg-p {
  background: #4682B4;
  /* 钢蓝色 */
}

.bg-q {
  background: #CD5C5C;
  /* 印度红 */
}

.bg-r {
  background: #9370DB;
  /* 中紫色 */
}

.bg-s {
  background: #3CB371;
  /* 中海绿 */
}

.bg-t {
  background: #778899;
  /* 亮石板灰 */
}

.bg-u {
  background: #BDB76B;
  /* 暗卡其色 */
}

.bg-v {
  background: #DB7093;
  /* 苍紫红 */
}

.bg-w {
  background: #9999CC;
  /* 淡紫色 */
}

.bg-x {
  background: #DAA520;
  /* 金菊色 */
}

.bg-y {
  background: #20B2AA;
  /* 亮海绿 */
}

.bg-z {
  background: #BC8F8F;
  /* 玫瑰褐色 */
}

.sticky {
  position: sticky;
  height: fit-content;
}

/* 添加 SVG 背景图案 */
.bg-pattern {
  background-color: #e2e8f0;
  /* 更深的背景色 */
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%236B7280' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E");
}
.animated-wave {
  position: relative;
  display: inline-block;
  font-size: 24px;
  padding-bottom: 13px;
  color: #333;
  font-family: Arial, sans-serif;
}

.wave-container {
  position: absolute;
  bottom: 0px;
  width: 100%;
  overflow: hidden;
}

.wave-path {
  stroke-linecap: round;
}

/* 添加卡片容器样式 */
.card-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.card-container > * {
  grid-column: 1;
  grid-row: 1;
}
</style>
