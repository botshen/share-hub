<script lang="ts" setup>
import CommentList from "./comment-list/CommentList.vue";
import { useOptionsStore } from "./use-options-store";

const { currentTodo } = useOptionsStore();

 
</script>
<template>
  <main class="mx-auto m-4 block " id="card">
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
      <div class="text-2xl font-bold px-2 pt-2" :contentEditable="true" :innerHTML="currentTodo?.title" />
      <div class="p-2 cursor-pointer break-words" :contentEditable="true" :innerHTML="currentTodo?.postContent" />
      <CommentList   />
    </div>
    <footer class="text-center text-white mt-6 rounded-box text-base">
      本图片由 ShareHub 浏览器插件生成
    </footer>
  </main>
</template>
