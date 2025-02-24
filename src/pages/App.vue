<script lang="ts" setup>
import { useOptionsStore } from "./use-options-store";
import { onMessage } from "@/utils/message";
import MessageTip from "@/components/MessageTip.vue";
import CommentList from "./comment-list/CommentList.vue";
import PostList from "./post-list/PostList.vue";
import ActionBar from "./action-bar/ActionBar.vue";
import {
  FontSize,
  postFontSizeMap,
  TitleFontSize,
  titleFontSizeMap,
  widthMap,
  WidthSize,
} from "@/utils/post-config";

const { todos, getTodos, currentTodoId, currentTodo, config } =
  useOptionsStore();

onMessage("openOptionsPage", async () => {
  await getTodos();
});

const detailCss = (newVal: typeof config.value) => {
  console.log("config", newVal);
  const card = document.getElementById("card");
  if (card) {
    card.style.width = widthMap[newVal.width as WidthSize];
    card.style.fontSize = postFontSizeMap[newVal.fontSize as FontSize];
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
  <div class="flex bg-cover px-[100px] mt-2">
    <PostList />
    <main class="mx-auto bg-white w-[448px] border rounded-box p-4 py-6 m-4" id="card">
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
      <x-title class="font-bold block my-2 p-2" id="title">{{
        currentTodo?.title
      }}</x-title>
      <div class="p-2 cursor-pointer whitespace-pre-wrap break-words" :contentEditable="true"
        :innerHTML="currentTodo?.postContent" />
      <CommentList />
      <!-- <footer class="text-center text-gray-500 bg-gray-100 p-2 mt-4 mx-3 rounded-box text-sm" v-if="!onlyEditorVisible">
        本图片由 ShareHub 浏览器插件生成
      </footer> -->
    </main>
    <ActionBar />
  </div>
</template>
