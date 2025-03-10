<script lang="ts" setup>
import Tiptap from "@/components/Tiptap.vue";
import CommentList from "./comment-list/CommentList.vue";
import { useOptionsStore } from "./use-options-store";
import PostLogo from "@/components/PostLogo.vue";
import PostDetail from "@/components/PostDetail.vue";
const { currentTodo } = useOptionsStore();
</script>
<template>
  <main class="mx-auto m-4 block" id="card">
    <div class="drop p-4 rounded-box h-full">
      <PostDetail :post="currentTodo" />
      <CommentList class="mt-4" />
    </div>
    <footer class="text-center text-white mt-6 rounded-box text-base">
      本图片由 ShareHub 浏览器插件生成
    </footer>
  </main>
</template>
