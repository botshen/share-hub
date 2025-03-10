<template>
  <div>
    <span class="text-lg font-bold ml-2" v-if="commentTextVisible">评论</span>
    <span class="label-text text-xs text-gray-500 ml-2" v-if="commentTipVisible">勾选评论以在导出时显示</span>
    <div v-for="comment in currentTodo?.comments" :key="comment.id">
      <CommentDetail :comment="comment" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useOptionsStore } from "../use-options-store";
import CommentDetail from "@/components/CommentDetail.vue";
const { onlyEditorVisible, currentTodo } = useOptionsStore();

const commentTextVisible = computed(() => {
  return (
    (onlyEditorVisible.value ||
      currentTodo.value?.comments?.some((c: any) => c.isChecked)) &&
    currentTodo.value?.comments?.length > 0
  );
});
const commentTipVisible = computed(() => {
  return onlyEditorVisible.value && currentTodo.value?.comments?.length > 0;
});
</script>
