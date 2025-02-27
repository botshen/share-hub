<script lang="ts" setup>
import { ColorPreset, transformObjToTailwindcss } from "@/utils/post-config";
import { useOptionsStore } from "../use-options-store";
 
const { currentTodo, config, isCopying, isDownloading, successInfoVisible,bgClass } = useOptionsStore();

// 定义配置选项
const configOptions = {
  color: [
    'b', 'default', 'a', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ],
  width: ['sm', 'md', 'lg', 'xl', 'full'],
  padding: ['sm', 'md', 'lg', 'xl'],
  format: ['png', 'jpeg', 'svg', 'webp'],
  fontSize: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
  imageQuality: ['1', '2', '3', '4']
};

const handleCopy = async () => {
  isCopying.value = true;
  const dataUrl = await generateImage({
    format: config.value.format,
    width: 448,
    height: 600,
    fontFamily: "Arial",
    scale: parseInt(config.value.imageQuality),
  });
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    throw new Error('无效的数据URL格式');
  }
  const [, mimeType] = matches;
  const blob = await fetch(dataUrl).then((res) => res.blob());
  await navigator.clipboard.write([
    new ClipboardItem({
      [mimeType]: blob
    })
  ]);

  isCopying.value = false;
  successInfoVisible.value = true;
  setTimeout(() => {
    successInfoVisible.value = false;
  }, 2000);
};
const handleDownload = async () => {
  isDownloading.value = true;
  const dataUrl = await generateImage({
    format: config.value.format,
    width: 448,
    height: 600,
    fontFamily: "Arial",
    scale: parseInt(config.value.imageQuality),
  });
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${currentTodo.value?.title ?? "image"}${new Date().toISOString().slice(0, 10)}_${new Date().toLocaleTimeString().replace(/:/g, '-')}`;
  a.click();
  isDownloading.value = false;
};
const handleReadMode = () => {
   config.value.width='full'
  config.value.padding='sm'
  config.value.fontSize='lg'
  }


</script>
<template>
  <div class="shrink-0 flex flex-col w-[300px]">
    <!-- 颜色选择 -->
    <legend class="fieldset-legend">COLOR</legend>
    <div class="grid grid-cols-7 gap-2">
      <template v-for="color in configOptions.color" :key="color">
        <input
          type="radio"
          name="color"
          :value="color"
          v-model="config.color"
          :class="[
            'btn w-8 h-8',
            `bg-${color}`,
            { 'ring-2 ring-blue-500': config.color === color }
          ]"
        />
      </template>
    </div>

    <!-- 其他配置项 -->
    <template v-for="(options, key) in configOptions" :key="key">
      <template v-if="key !== 'color'">
        <legend class="fieldset-legend">{{ key.toUpperCase() }}</legend>
        <div class="flex gap-2" :class="{ 'flex-wrap': key === 'fontSize' }">
          <input
            v-for="value in options"
            :key="value"
            type="radio"
            :name="key"
            :value="value"
            v-model="config[key]"
            :aria-label="value"
            class="btn btn-neutral"
            :class="{
              'bg-blue-500 text-white border-blue-500': config[key] === value
            }"
          />
        </div>
      </template>
    </template>

    <!-- 按钮组 -->
    <button class="btn btn-neutral mt-2" @click="handleReadMode">
      Read Mode
    </button>
    <button class="btn btn-neutral my-2" @click="handleDownload">
      <span v-if="isDownloading" class="loading loading-spinner"></span>
      Download
    </button>
    <button class="btn btn-neutral" @click="handleCopy">
      <span v-if="isCopying && !isDownloading" class="loading loading-spinner"></span>
      Copy
    </button>
  </div>
</template>
