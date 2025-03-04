<script lang="ts" setup>
import { sharePostCommon } from "./get-post/common";
import { sharePostReddit } from "./get-post/reddit/reddit";
import { sharePostV2ex } from "./get-post/v2ex/v2ex";
import { getWebKind } from "@/utils/get-web-kind";
import { sharePostHacknews } from "./get-post/hacknews/hacknews";
import logo from "./logo.svg";
import { sharePostX } from "./get-post/x/x";
 import { shallowRef} from 'vue';
 const xData = shallowRef(null)
const onClick = () => {
  const webKind = getWebKind();
  if (webKind === "v2ex") {
    sharePostV2ex();
  } else if (webKind === "reddit") {
    sharePostReddit();
  } else if (webKind === "hacknews") {
    sharePostHacknews();
  } else if (webKind === "x") {
    sharePostX(xData.value);
  } else  {
    sharePostCommon();
  }
};

window.addEventListener('todo', ((event: Event) => {
      const customEvent = event as CustomEvent
      console.log('customEvent.detail22222', customEvent.detail)
      // 添加类型检查和错误处理
      xData.value = customEvent.detail
    }) as EventListener)
 
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
