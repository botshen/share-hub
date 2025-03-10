<script lang="ts" setup>
import PostLogo from './PostLogo.vue'
import Tiptap from './Tiptap.vue'

type LogoSource = 'v2ex' | 'reddit' | 'hacknews' | 'x'
type Post = {
  avatarUrl: string
  author: string
  id: string
  source: string
  url: string
  title: string
  content: string
  mediaPhotosUrl: string[]
  quotedUser: string
  quotedContent: string
  quotedUserImage: string
  quotedImg: string

  conversationId: string
  replyId: string
}
defineProps<{
  post: Post
}>()

</script>
<template>
  <header class="flex items-center justify-between gap-2 mb-4">
    <div class="flex items-center gap-2">
      <div class="avatar" v-if="post?.avatarUrl">
        <div class="w-12 rounded-full">
          <img :src="post.avatarUrl" alt="用户头像" />
        </div>
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-medium">{{ post?.author }}</span>
        <div class="text-xs text-red-500">{{ post?.id }}</div>
      </div>
    </div>
    <PostLogo v-if="post?.source" :url="post?.url" :source="post?.source as LogoSource" />
  </header>

  <div class="post-content">
    <Tiptap v-if="post?.title" class="text-2xl font-bold mb-3" :content="post?.title" />
    <Tiptap v-if="post?.content" class="mb-4 cursor-pointer" :content="post?.content" />

    <div v-if="post?.mediaPhotosUrl?.length" class="media-gallery grid gap-2 mb-4">
      <img v-for="mediaPhotoUrl in post?.mediaPhotosUrl" :key="mediaPhotoUrl" :src="mediaPhotoUrl"
        class="rounded-lg w-full object-cover" alt="媒体图片" />
    </div>

    <div v-if="post?.quotedUser || post?.quotedContent" class="quoted-content p-3 border rounded-lg mb-4">
      <div v-if="post?.quotedUserImage" class="flex items-center mb-2">
        <img class="w-8 h-8 rounded-full mr-2" :src="post?.quotedUserImage" alt="引用用户头像" />
        <span class="font-medium">{{ post?.quotedUser }}</span>
      </div>
      <Tiptap v-if="post?.quotedContent" :content="post?.quotedContent" />
      <img v-if="post?.quotedImg" :src="post?.quotedImg" class="mt-2 rounded-lg w-full object-cover" alt="引用图片" />
    </div>
  </div>
</template>
