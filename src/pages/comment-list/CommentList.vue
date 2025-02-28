<script lang="ts" setup>
import { useOptionsStore } from "../use-options-store";
const { onlyEditorVisible, currentTodo } = useOptionsStore();
const handleCommentSelect = (commentId: number, checked: boolean) => {
  const comment = currentTodo.value?.comments.find(
    (c: any) => c.id === commentId,
  );
  if (comment) {
    comment.isChecked = checked;
  }
};
</script>
<template>
  <div>
     <span class="text-lg font-bold" v-if="
      (onlyEditorVisible || currentTodo?.comments?.some((c: any) => c.isChecked)) && currentTodo?.comments?.length > 0
    ">评论</span>
    <span class="label-text text-xs text-gray-500 ml-2" v-if="onlyEditorVisible && currentTodo?.comments?.length > 0">勾选评论以在导出时显示</span>

    <div v-for="comment in currentTodo?.comments" :key="comment.id">
      <div id="comment" class="px-2 block" v-if="onlyEditorVisible || comment.isChecked">
        <div class="divider h-1"></div>
        <div class="flex items-center gap-2">
          <div class="mask mask-squircle w-8">
            <img :src="comment.avatarUrl" />
          </div>
          <span class="font-bold">{{ comment.author }}</span>
          <label class="cursor-pointer label" v-if="onlyEditorVisible">
            <input type="checkbox" :checked="comment.isChecked" class="checkbox checkbox-success" @change="
              (e) =>
                handleCommentSelect(
                  comment.id,
                  (e.target as HTMLInputElement).checked,
                )
            " />
          </label>
        </div>
        <div class="break-words ml-10 mt-1" v-html="comment.content" />
      </div>
    </div>
  </div>
</template>
