<script lang="ts" setup>
const handleMessage = (message: any) => {
  console.log("message", message);
};
browser.runtime.onMessage.addListener(handleMessage);
</script>

<template>
  <div>
    <h1 class="text-6xl font-bold text-red-600">Options</h1>
    <button class="btn">
      <span class="loading loading-spinner"></span>
      loading
    </button>
  </div>
</template>
