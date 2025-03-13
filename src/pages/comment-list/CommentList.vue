<template>
  <div>
    <div class="flex items-center" v-if="commentTextVisible">
      <span class="text-lg font-bold ml-2">精选评论</span>
      <input 
        type="checkbox" 
        class="checkbox checkbox-sm ml-4" 
        :checked="allCommentsChecked"
        @change="toggleAllComments" 
        v-if="currentTodo?.comments?.length > 0 && commentTipVisible"
      />
      <span class="text-xs text-gray-500 ml-1" v-if="currentTodo?.comments?.length > 0 && commentTipVisible">全选</span>
    </div>
     <div v-for="comment in currentTodo?.comments" :key="comment.id">
      <CommentDetail :comment="comment" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useOptionsStore } from "../use-options-store";
import CommentDetail from "@/components/CommentDetail.vue";
import { computed } from "vue";
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

const allCommentsChecked = computed(() => {
  return currentTodo.value?.comments?.length > 0 && 
         currentTodo.value?.comments?.every((c: any) => c.isChecked);
});

function toggleAllComments(e: Event) {
  const isChecked = (e.target as HTMLInputElement).checked;
  if (currentTodo.value?.comments) {
    currentTodo.value.comments.forEach((comment: any) => {
      comment.isChecked = isChecked;
    });
  }
}
</script>
