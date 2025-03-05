<script lang="ts" setup>
import { useOptionsStore } from "../use-options-store";
const { onlyEditorVisible, currentTodo } = useOptionsStore();

type DepthLevel =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

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
  0: "ml-0",
  1: "ml-[16px]",
  2: "ml-[32px]",
  3: "ml-[48px]",
  4: "ml-[64px]",
  5: "ml-[80px]",
  6: "ml-[96px]",
  7: "ml-[112px]",
  8: "ml-[128px]",
  9: "ml-[144px]",
  10: "ml-[160px]",
  11: "ml-[176px]",
  12: "ml-[192px]",
  13: "ml-[208px]",
  14: "ml-[224px]",
  15: "ml-[240px]",
  16: "ml-[256px]",
  17: "ml-[272px]",
  18: "ml-[288px]",
  19: "ml-[304px]",
  20: "ml-[320px]",
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
const commentVisible = (comment: Comment) => {
  return onlyEditorVisible.value || comment.isChecked;
};
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
<template>
  <div>
    <span class="text-lg font-bold ml-2" v-if="commentTextVisible">评论</span>
    <span class="label-text text-xs text-gray-500 ml-2" v-if="commentTipVisible">勾选评论以在导出时显示</span>

    <div v-for="comment in currentTodo?.comments" :key="comment.id">
      <div id="comment" class="px-2 block" v-if="commentVisible(comment)"
        :class="depthMap[comment.depth as DepthLevel]">
        <div class="divider h-1" v-if="!comment.depth || comment.depth === '0'"></div>
        <div class="flex items-center gap-2">
          <div class="avatar">
            <div class="w-8 rounded-full" v-if="comment.avatarUrl">
              <img :src="comment.avatarUrl" />
            </div>
          </div>
          <span class="font-bold">{{ comment.author }}</span>
          <span class="text-gray-500" v-if="comment.replayUser" >@{{ comment.replayUser }}</span>
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
        <!-- <div class="text-xs text-red-500">{{ comment.id }}</div> -->

        <div class="break-words p-2" :class="comment.avatarUrl ? 'ml-10' : ''" :contentEditable="true"
          :innerHTML="comment.content" />
        <div v-if="comment.imageUrl" :class="comment.avatarUrl ? 'pl-10 w-full' : 'w-full'">
          <img :src="comment.imageUrl" />
        </div>
        <div v-if="comment.mediaPhotosUrl" :class="comment.avatarUrl ? 'pl-10 w-full' : 'w-full'">
          <img :src="comment.mediaPhotosUrl" />
        </div>
      </div>
    </div>
  </div>
</template>
