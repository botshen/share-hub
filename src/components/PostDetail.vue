<script lang="ts" setup>
import Tiptap from './Tiptap.vue'
import PostLogo from './PostLogo.vue'

type LogoSource = 'v2ex' | 'reddit' | 'hacknews' | 'x'
type Comment = {
  avatarUrl: string
  author: string
  id: string
  source: string
  url: string
  title: string
  postContent: string
  mediaPhotosUrl: string[]
  mainQuotedUserImage: string
  mainQuotedUser: string
  mainQuotedContent: string
  mainQuotedImg: string
  conversationId: string
  replyId: string
}
defineProps<{
  comment: Comment
}>()

</script>
<template>
  <header class="flex items-center justify-between gap-2 mb-4">
    <div class="flex items-center gap-2">
      <div class="avatar" v-if="comment?.avatarUrl">
        <div class="w-12 rounded-full">
          <img :src="comment.avatarUrl" alt="用户头像" />
        </div>
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-medium">{{ comment?.author }}</span>
        <div class="text-xs text-red-500">{{ comment?.id }}</div>
      </div>
    </div>
    <PostLogo v-if="comment?.source" :url="comment?.url" :source="comment?.source as LogoSource" />
  </header>

  <div class="comment-content">
    <Tiptap v-if="comment?.title" class="text-2xl font-bold mb-3" :content="comment?.title" />
    <Tiptap v-if="comment?.postContent" class="mb-4 cursor-pointer" :content="comment?.postContent" />

    <div v-if="comment?.mediaPhotosUrl?.length" class="media-gallery grid gap-2 mb-4">
      <img v-for="mediaPhotoUrl in comment?.mediaPhotosUrl" :key="mediaPhotoUrl" :src="mediaPhotoUrl"
        class="rounded-lg w-full object-cover" alt="媒体图片" />
    </div>

    <div v-if="comment?.mainQuotedUser || comment?.mainQuotedContent" class="quoted-content p-3 border rounded-lg mb-4">
      <div v-if="comment?.mainQuotedUserImage" class="flex items-center mb-2">
        <img class="w-8 h-8 rounded-full mr-2" :src="comment?.mainQuotedUserImage" alt="引用用户头像" />
        <span class="font-medium">{{ comment?.mainQuotedUser }}</span>
      </div>
      <Tiptap v-if="comment?.mainQuotedContent" :content="comment?.mainQuotedContent" />
      <img v-if="comment?.mainQuotedImg" :src="comment?.mainQuotedImg" class="mt-2 rounded-lg w-full object-cover"
        alt="引用图片" />
    </div>
  </div>
</template>
