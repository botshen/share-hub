<script lang="ts" setup>
import { ColorPreset, transformObjToTailwindcss } from "@/utils/post-config";
import { useOptionsStore } from "../use-options-store";
import ColorPicker from "@/components/ColorPicker.vue";

const { currentTodo, config, isCopying, isDownloading, successInfoVisible,bgClass } = useOptionsStore();
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
const handlePresetSelect = (preset: ColorPreset) => {
  console.log('preset',preset)
  const classname = transformObjToTailwindcss(preset)
  bgClass.value=classname
  };


</script>
<template>
  <x-action-bar class="shrink-0 flex flex-col w-[300px] ">
    <ColorPicker class="shrink-0" @preset-selected="handlePresetSelect" />
    <legend class="fieldset-legend">WIDTH</legend>
    <div class="flex gap-2">
      <input type="radio" name="width" value="sm" v-model="config.width" aria-label="sm" class="btn" />
      <input type="radio" name="width" value="md" v-model="config.width" aria-label="md" class="btn" />
      <input type="radio" name="width" value="lg" v-model="config.width" aria-label="lg" class="btn" />
      <input type="radio" name="width" value="xl" v-model="config.width" aria-label="xl" class="btn" />
    </div>
    <legend class="fieldset-legend">PADDING</legend>
      <div class="flex gap-2">
        <input type="radio" name="padding" value="sm" v-model="config.padding" aria-label="sm" class="btn" />
        <input type="radio" name="padding" value="md" v-model="config.padding" aria-label="md" class="btn" />
        <input type="radio" name="padding" value="lg" v-model="config.padding" aria-label="lg" class="btn" />
        <input type="radio" name="padding" value="xl" v-model="config.padding" aria-label="xl" class="btn" />
      </div> 
    <legend class="fieldset-legend">FORMAT</legend>
    <div class="flex gap-2">
      <input type="radio" name="format" value="png" v-model="config.format" aria-label="png" class="btn" />
      <input type="radio" name="format" value="jpeg" v-model="config.format" aria-label="jpeg" class="btn" />
      <input type="radio" name="format" value="svg" v-model="config.format" aria-label="svg" class="btn" />
      <input type="radio" name="format" value="webp" v-model="config.format" aria-label="webp" class="btn" />
    </div>
    <legend class="fieldset-legend">FONT SIZE</legend>
    <div class="flex gap-2 flex-wrap">
      <input type="radio" name="fontSize" value="xs" v-model="config.fontSize" aria-label="xs" class="btn" />
      <input type="radio" name="fontSize" value="sm" v-model="config.fontSize" aria-label="sm" class="btn" />
      <input type="radio" name="fontSize" value="md" v-model="config.fontSize" aria-label="md" class="btn" />
      <input type="radio" name="fontSize" value="lg" v-model="config.fontSize" aria-label="lg" class="btn" />
      <input type="radio" name="fontSize" value="xl" v-model="config.fontSize" aria-label="xl" class="btn" />
      <input type="radio" name="fontSize" value="2xl" v-model="config.fontSize" aria-label="2xl" class="btn" />
      <input type="radio" name="fontSize" value="3xl" v-model="config.fontSize" aria-label="3xl" class="btn" />
    </div>
    <legend class="fieldset-legend">IMAGE QUALITY</legend>
    <div class="flex gap-2">
      <input type="radio" name="imageQuality" value="1" v-model="config.imageQuality" aria-label="normal" class="btn" />
      <input type="radio" name="imageQuality" value="2" v-model="config.imageQuality" aria-label="high" class="btn" />
      <input type="radio" name="imageQuality" value="3" v-model="config.imageQuality" aria-label="super" class="btn" />
      <input type="radio" name="imageQuality" value="4" v-model="config.imageQuality" aria-label="ultra" class="btn" />
    </div>
    <button class="btn btn-block my-2" @click="handleDownload">
      <span v-if="isDownloading" class="loading loading-spinner">
      </span>
      Download</button>
    <button class="btn btn-block" @click="handleCopy">
      <span v-if="isCopying && !isDownloading" class="loading loading-spinner">
      </span>
      Copy</button>
  </x-action-bar>
</template>
