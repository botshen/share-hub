<script lang="ts" setup>
import { useOptionsStore } from "./use-options-store";
import { onMessage } from "@/utils/message";
import MessageTip from "@/components/MessageTip.vue";
import CommentList from "./comment-list/CommentList.vue";
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
import PostLogo from "@/components/PostLogo.vue";

const { todos, getTodos, currentTodoId, currentTodo, config, bgClass, onlyEditorVisible } =
  useOptionsStore();

onMessage("openOptionsPage", async () => {
  await getTodos();
});

const detailCss = (newVal: typeof config.value) => {
  console.log("theme-config", newVal);
  const card = document.getElementById("card");
  if (card) {
    card.style.width = widthMap[newVal.width as WidthSize];
    card.style.fontSize = postFontSizeMap[newVal.fontSize as FontSize];
    if (card.className.includes('bg-')) {
      card.className = card.className.replace(/bg-[^ ]+/, `bg-${newVal.color}`);
    } else {
      card.className = card.className + ` bg-${newVal.color}`;
    }
    card.style.padding = paddingMap[newVal.padding as keyof typeof paddingMap];
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
};
watch(
  config,
  (newVal) => {
    detailCss(newVal);
  },
  { deep: true, immediate: true },
);

watch(
  currentTodoId,
  (newVal) => {
    console.log("newVal", newVal);
    if (!todos.value) return;

    if (newVal) {
      currentTodo.value = todos.value?.find((todo) => todo.id === newVal);
    } else {
      console.log("todos.value", todos.value);
      currentTodo.value = todos.value?.[0];
    }
  },
  { immediate: true, deep: true },
);
onMounted(async () => {
  await getTodos();
  detailCss(config.value);
});
</script>

<template>
  <MessageTip />
  <div class="flex bg-pattern px-[100px] h-full ">
    <div class="sticky top-2 mr-4">
      <PostList />
    </div>
    <main class="mx-auto m-4 block" id="card">
      <div class="drop p-4 rounded-box h-full">
        <header class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <div class="avatar" v-if="currentTodo?.avatarUrl">
              <div class="mask mask-squircle w-10">
                <img :src="currentTodo?.avatarUrl" />
              </div>
            </div>
            <span class="text-lg ml-2">{{ currentTodo?.author }}</span>
          </div>
          <PostLogo v-if="currentTodo?.source" :source="currentTodo?.source" />
        </header>
        <div class="text-2xl font-bold px-2 pt-2 " :contentEditable="true" :innerHTML="currentTodo?.title" />
        <div class="p-2 cursor-pointer break-words" :contentEditable="true" :innerHTML="currentTodo?.postContent" />
        <CommentList />
      </div>
      <footer class="text-center text-white  mt-6   rounded-box text-base">
        本图片由 ShareHub 浏览器插件生成
      </footer>
    </main>
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
</style>
