<script lang="ts" setup>
import { useOptionsStore } from "../use-options-store";
const { onlyEditorVisible, currentTodo } = useOptionsStore();

type DepthLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// 添加 Comment 接口定义
interface Comment {
  id: number;
  author: string;
  avatarUrl: string;
  content: string;
  isChecked: boolean;
  depth: DepthLevel;
}

const depthMap: Record<DepthLevel, string> = {
  0: 'ml-0',
  1: 'ml-[16px]',
  2: 'ml-[32px]',
  3: 'ml-[48px]',
  4: 'ml-[64px]',
  5: 'ml-[80px]',
  6: 'ml-[96px]',
} as const;

// 更新类型
const handleCommentSelect = (commentId: number, checked: boolean) => {
  const comment = currentTodo.value?.comments.find(
    (c: Comment) => c.id === commentId,
  );
  if (comment) {
    comment.isChecked = checked;
  }
};
</script>
<template>
  <div>
     <span class="text-lg font-bold ml-2" v-if="
      (onlyEditorVisible || currentTodo?.comments?.some((c: any) => c.isChecked)) && currentTodo?.comments?.length > 0
    ">评论</span>
    <span class="label-text text-xs text-gray-500 ml-2" v-if="onlyEditorVisible && currentTodo?.comments?.length > 0">勾选评论以在导出时显示</span>

    <div v-for="comment in currentTodo?.comments" :key="comment.id">
       <div id="comment" class="px-2 block" v-if="onlyEditorVisible || comment.isChecked" :class="depthMap[(comment.depth as DepthLevel)]">
        <div class="divider h-1" v-if="!comment.depth||comment.depth==='0'"></div>
        <div class="flex items-center gap-2">
          <div class="mask mask-squircle w-8" v-if="comment.avatarUrl">
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
        <div class="break-words p-2" :class="comment.avatarUrl ? 'ml-10' : ''" :contentEditable="true"
        :innerHTML="comment.content" />
      </div>
    </div>
  </div>
</template>
