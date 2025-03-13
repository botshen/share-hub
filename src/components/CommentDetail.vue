<script lang="ts" setup>
import Tiptap from "@/components/Tiptap.vue";
import { useOptionsStore } from '@/pages/use-options-store';

type Comment = {
  id: number | string
  source: string
  url: string
  title: string
  postContent: string
  avatarUrl: string
  author: string
  replayUser: string
  isChecked: boolean
  depth: number | string
  content: string
  imageUrl: string
  mediaPhotosUrl: string[]
  cardInfo: Record<string, any>
  quotedContent: string
  quotedUser: string
  quotedUserImage: string
  quotedImg: string
  conversationId: string
  replyId: string
}
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
const { onlyEditorVisible, currentTodo } = useOptionsStore();
defineProps<{
  comment: Comment
}>()
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
const handleCommentSelect = (commentId: number | string, checked: boolean) => {
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

</script>
<template>
  <div id="comment" class="px-2 block" v-if="commentVisible(comment)" :class="depthMap[comment.depth as DepthLevel]">
    <div class="divider h-1" v-if="!comment.depth || comment.depth === '0'"></div>
    <div class="flex items-center gap-2">
      <div class="avatar">
        <div class="w-8 rounded-full" v-if="comment.avatarUrl">
          <img :src="comment.avatarUrl" />
        </div>
      </div>
      <span class="font-bold">{{ comment.author }}</span>
      <span class="text-gray-500" v-if="comment.replayUser">@{{ comment.replayUser }}</span>
      <label class="cursor-pointer label" v-if="onlyEditorVisible">
        <input type="checkbox" :checked="comment.isChecked" class="checkbox  " @change="
          (e) =>
            handleCommentSelect(
              comment.id,
              (e.target as HTMLInputElement).checked,
            )
        " />
      </label>
      <!-- <span class="text-xs text-red-500">{{ comment.id }}</span> -->

    </div>
    <Tiptap v-if="comment.content" :class="comment.avatarUrl ? 'ml-10' : ''" :content="comment.content"
      class="  cursor-pointer break-words whitespace-pre-wrap" />
    <div v-if="comment.imageUrl" :class="comment.avatarUrl ? 'pl-10 w-full' : 'w-full'">
      <img :src="comment.imageUrl" />
    </div>
    <div v-if="comment.mediaPhotosUrl" :class="comment.avatarUrl ? 'pl-10 w-full' : 'w-full'">
      <img v-for="mediaPhotoUrl in comment.mediaPhotosUrl" :key="mediaPhotoUrl" :src="mediaPhotoUrl" />
    </div>
    <div v-if="comment?.cardInfo?.thumbnailUrl" class="mt-4 flex items-center gap-4 rounded-lg shadow-md   transition-shadow p-2 bg-white/80 backdrop-blur">
      <div v-if="comment?.cardInfo?.thumbnailUrl" class="shrink-0">
        <img :src="comment?.cardInfo?.thumbnailUrl" :alt="comment?.cardInfo?.title"
          class="rounded-md object-cover w-12 h-12" />
      </div>
      <div class="flex-1 min-w-0">
        <span class="font-medium text-gray-900 truncate">{{ comment?.cardInfo?.title }}</span>
        <div class="flex items-center gap-3 text-sm text-gray-500">
          <span class="truncate">{{ comment?.cardInfo?.appName }}</span>
        </div>
      </div>
    </div>
 
    <div class="border border-gray-400 rounded-md p-3 bg-[rgba(0,0,0,0.00)]"
      :class="comment.avatarUrl ? 'ml-10 ' : 'w-full'" v-if="comment.quotedUser">
      <div class="flex items-center gap-2 mb-2">
        <div class="avatar">
          <div class="w-8 rounded-full" v-if="comment.quotedUserImage">
            <img :src="comment?.quotedUserImage" />
          </div>
        </div>
        <div v-if="comment?.quotedUser">
          <span class="text-gray-500">{{ comment?.quotedUser }}</span>
        </div>
      </div>
      <div v-if="comment?.quotedContent">
      <span class="text-gray-500">{{ comment?.quotedContent }}</span>
    </div>
      <div v-if="comment?.quotedImg">
        <img :src="comment?.quotedImg" class="rounded-md" />
      </div>
    </div>
  


  </div>
</template>
