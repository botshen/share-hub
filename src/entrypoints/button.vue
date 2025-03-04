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

window.addEventListener("x-data", ((event: Event) => {
  const customEvent = event as CustomEvent;
  console.log("customEvent.detail22222", customEvent.detail);
  const currentTodo = {
    id: customEvent.detail.id,
    postContent: customEvent.detail.postContent,
    title: customEvent.detail.title,
    author: customEvent.detail.author,
    url: customEvent.detail.url,
    avatarUrl: customEvent.detail.avatarUrl,
    comments: customEvent.detail.comments,
    postscripts: [],
    source: "x",
  };
  const todosRepo = getTodosRepo();
  todosRepo.update(currentTodo);
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
