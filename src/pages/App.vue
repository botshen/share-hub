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

const { todos, getTodos, currentTodoId, currentTodo, config,bgClass,onlyEditorVisible } =
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
      if( card.className.includes('bg-')){
      card.className = card.className.replace(/bg-[^ ]+/, `bg-${newVal.color}`);
     }else{
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
  <div class="flex bg-cover px-[100px] mt-2 ">
    <div class="sticky top-2 mr-4">
      <PostList />
    </div>
    <main class="mx-auto m-4 block" id="card">
      <div class="drop p-4 rounded-box h-full">
        <header class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <div class="avatar">
              <div class="mask mask-squircle w-10">
                <img :src="currentTodo?.avatarUrl" />
              </div>
            </div>
            <span class="text-lg">{{ currentTodo?.author }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500">
            V2ex
            <svg t="1740317552775" class="icon size-8 opacity-30" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="2627" width="200" height="200">
              <path
                d="M46.08 47.616c-6.656 8.192-10.24 62.976-10.24 179.712v167.424h542.72l44.544 52.736c24.576 28.672 44.544 58.88 44.544 67.584 0 8.192-20.48 37.888-45.056 67.072l-45.056 51.712H35.84v160.768c0 90.624 3.584 168.448 8.704 179.712 8.704 17.92 21.504 18.944 298.496 18.944 158.72 0 295.424-3.072 302.08-6.144 7.68-3.072 92.16-104.96 188.416-224.256 149.504-186.368 175.104-222.208 175.104-248.32s-18.944-54.784-116.736-177.664C827.904 256 746.496 155.648 710.656 112.64L646.144 35.84H351.744C133.12 35.84 53.76 38.912 46.08 47.616z"
                fill="#707070" p-id="2628"></path>
            </svg>
          </div>
        </header>
        <div class="font-bold block my-2 p-2" id="title">{{
          currentTodo?.title
          }}</div>
        <div class="p-2 cursor-pointer whitespace-pre-wrap break-words" :contentEditable="true"
          :innerHTML="currentTodo?.postContent" />
        <CommentList />
      </div>
      <footer class="text-center text-gray-500 bg-gray-100 p-2 mt-4 mx-3 rounded-box text-sm" v-if="!onlyEditorVisible">
        本图片由 ShareHub 浏览器插件生成
      </footer>
    </main>
    <div class="sticky top-2 ml-4">
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
.bg-default{
  background: linear-gradient(to right, #ff8008, #ffc837); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.bg-a{
  background: linear-gradient(to right, #cc2b5e, #753a88); 
}
.bg-b{
  background: linear-gradient(to right, #2193b0, #6dd5ed); 
}
.bg-c{
  background: linear-gradient(to right, #00416a, #e4e5e6);
}
.bg-d{
  background: linear-gradient(to top, #ffe259, #ffa751);
}
.bg-e{
  background: linear-gradient(to top, #799f0c, #acbb78);
}
.bg-f{
  background: linear-gradient(to top, #5433ff, #20bdff, #a5fecb);
}
.bg-g{
  background: linear-gradient(to top, #0052d4, #4364f7, #6fb1fc);
}
.bg-h{
  background: linear-gradient(to top, #00416a, #799f0c, #ffe000);
}
.bg-i{
  background: linear-gradient(to top, #bdc3c7, #2c3e50);
}
.bg-j{
  background: linear-gradient(to top, #ee9ca7, #ffdde1);
}
.bg-k{
  background: linear-gradient(to top, #c6ffdd, #fbd786, #f7797d);
}
.bg-l{
  background: linear-gradient(to top, #12c2e9, #c471ed, #f64f59);
}
.bg-m{
  background: linear-gradient(to right, #b92b27, #1565c0);
}
/* Start of Selection */
.bg-n {
  background: #E68A00;  /* 深橙色 */
}
.bg-o {
  background: #2E8B57;  /* 深海绿 */
}
.bg-p {
  background: #4682B4;  /* 钢蓝色 */
}
.bg-q {
  background: #CD5C5C;  /* 印度红 */
}
.bg-r {
  background: #9370DB;  /* 中紫色 */
}
.bg-s {
  background: #3CB371;  /* 中海绿 */
}
.bg-t {
  background: #778899;  /* 亮石板灰 */
}
.bg-u {
  background: #BDB76B;  /* 暗卡其色 */
}
.bg-v {
  background: #DB7093;  /* 苍紫红 */
}
.bg-w {
  background: #9999CC;  /* 淡紫色 */
}
.bg-x {
  background: #DAA520;  /* 金菊色 */
}
.bg-y {
  background: #20B2AA;  /* 亮海绿 */
}
.bg-z {
  background: #BC8F8F;  /* 玫瑰褐色 */
}
 
 
.sticky {
  position: sticky;
  height: fit-content;
}
 
</style>
