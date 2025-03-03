<script lang="ts" setup>
import { sharePostCommon } from "./get-post/common";
import { sharePostReddit } from "./get-post/reddit/reddit";
import { sharePostV2ex } from "./get-post/v2ex/v2ex";
import { getWebKind } from "@/utils/get-web-kind";
import { sharePostHacknews } from "./get-post/hacknews/hacknews";
import logo from "./logo.svg";
const onClick = () => {
  const webKind = getWebKind();
  if (webKind === "v2ex") {
    sharePostV2ex();
  } else if (webKind === "reddit") {
    sharePostReddit();
  } else if (webKind === "hacknews") {
    sharePostHacknews();
  } else {
    sharePostCommon();
  }
};
onMessage("setTwitterData", (data) => {
  console.log("data================", data);
});
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
