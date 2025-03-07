<script lang="ts" setup>
import { sharePostCommon } from "./get-post/common";
import { sharePostReddit } from "./get-post/reddit/reddit";
import { sharePostV2ex } from "./get-post/v2ex/v2ex";
import { getWebKind } from "@/utils/get-web-kind";
import { sharePostHacknews } from "./get-post/hacknews/hacknews";
import { getTodosRepo } from "@/utils/service";

import logo from "./logo.svg";
import { sharePostX } from "./get-post/x/x";
const xId = ref<string | null>(null);
const onClick = () => {
  const webKind = getWebKind();
  if (webKind === "v2ex") {
    sharePostV2ex();
  } else if (webKind === "reddit") {
    sharePostReddit();
  } else if (webKind === "hacknews") {
    sharePostHacknews();
  } else if (webKind === "x" && xId.value) {
    sharePostX(xId.value);
  } else {
    sharePostCommon();
  }
};

// 更新评论接口定义以匹配 Todo 类型中的评论结构
interface Comment {
  id: string | number | null | undefined;
  content: string | null | undefined;
  author: string | null | undefined;
  avatarUrl: string | null | undefined;
  replyId: string | number | null | undefined;
}

window.addEventListener("x-data", (async (event: Event) => {
  const customEvent = event as CustomEvent;
  const currentTodo = {
    id: customEvent.detail.id,
    postContent: customEvent.detail.postContent,
    title: customEvent.detail.title,
    author: customEvent.detail.author,
    url: customEvent.detail.url,
    avatarUrl: customEvent.detail.avatarUrl,
    comments: customEvent.detail.comments,
    mediaPhotosUrl: customEvent.detail.mediaPhotosUrl,
    postscripts: [],
    source: "x",
  };
  const todosRepo = getTodosRepo();
  const todo = await todosRepo.getOne(currentTodo.id);
  
  if (!todo) {
    todosRepo.create(currentTodo);
  } else {
    // 合并现有评论和新评论
    const existingComments = todo.comments || [];
    const newComments = currentTodo.comments || [];
    
    // 使用Map来存储评论，以id为键避免重复
    const commentMap = new Map();
    [...existingComments, ...newComments].forEach(comment => {
      commentMap.set(comment.id, comment);
    });
    
    // 将评论转换回数组并按照回复关系排序
    const mergedComments = Array.from(commentMap.values());
    const sortedComments: Comment[] = [];
    
    // 先添加没有回复ID的评论
    mergedComments.forEach(comment => {
      if (!comment.replyId) {
        sortedComments.push(comment);
      }
    });
    
    // 然后处理有回复ID的评论 
    mergedComments.forEach(comment => {
      if (comment.replyId) {
        const parentIndex = sortedComments.findIndex(c => c.id === comment.replyId);
        if (parentIndex !== -1) {
          sortedComments.splice(parentIndex + 1, 0, comment);
        } else {
          sortedComments.push(comment); // 如果找不到父评论，就加到最后
        }
      }
    });

    todosRepo.update({
      ...todo,
      comments: sortedComments,
    });
  }

  xId.value = currentTodo.id;
}) as EventListener);
</script>

<template>
  <img @click="onClick" :src="logo" class="icon" />
</template>

<style scoped lang="scss">
.icon {
  position: fixed;
  right: 0;
  top: 10%;
  padding: 6px;
  background-color: rgb(243 244 246);
  width: 30px;
  height: 30px;
  border: none;
  cursor: pointer;
  border-radius: 24px 0 0 24px;
  visibility: visible !important;
  z-index: 9999;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
