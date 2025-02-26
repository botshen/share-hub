<script lang="ts" setup>
import { ColorPreset, transformObjToTailwindcss } from "@/utils/post-config";
import { useOptionsStore } from "../use-options-store";
 
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
  <div class="shrink-0 flex flex-col w-[300px] ">
    <legend class="fieldset-legend">COLOR</legend>
    <div class="grid grid-cols-7 gap-2">
      <input type="radio" name="color" value="b" v-model="config.color"   class="btn bg-b w-8 h-8" />
      <input type="radio" name="color" value="default" v-model="config.color"   class="btn bg-default w-8 h-8" />
      <input type="radio" name="color" value="a" v-model="config.color"   class="btn bg-a w-8 h-8" />
      <input type="radio" name="color" value="d" v-model="config.color"   class="btn bg-d w-8 h-8" />
      <input type="radio" name="color" value="e" v-model="config.color"   class="btn bg-e w-8 h-8" />
      <input type="radio" name="color" value="f" v-model="config.color"   class="btn bg-f w-8 h-8" />
      <input type="radio" name="color" value="g" v-model="config.color"   class="btn bg-g w-8 h-8" />
      <input type="radio" name="color" value="h" v-model="config.color"   class="btn bg-h w-8 h-8" />
      <input type="radio" name="color" value="i" v-model="config.color"   class="btn bg-i w-8 h-8" />
      <input type="radio" name="color" value="j" v-model="config.color"   class="btn bg-j w-8 h-8" />
      <input type="radio" name="color" value="k" v-model="config.color"   class="btn bg-k w-8 h-8" />
      <input type="radio" name="color" value="l" v-model="config.color"   class="btn bg-l w-8 h-8" />
      <input type="radio" name="color" value="m" v-model="config.color"   class="btn bg-m w-8 h-8" />
      <input type="radio" name="color" value="n" v-model="config.color"   class="btn bg-n w-8 h-8" />
      <input type="radio" name="color" value="o" v-model="config.color"   class="btn bg-o w-8 h-8" />
      <input type="radio" name="color" value="p" v-model="config.color"   class="btn bg-p w-8 h-8" />
      <input type="radio" name="color" value="q" v-model="config.color"   class="btn bg-q w-8 h-8" />
      <input type="radio" name="color" value="r" v-model="config.color"   class="btn bg-r w-8 h-8" />
      <input type="radio" name="color" value="s" v-model="config.color"   class="btn bg-s w-8 h-8" />
      <input type="radio" name="color" value="t" v-model="config.color"   class="btn bg-t w-8 h-8" />
      <input type="radio" name="color" value="u" v-model="config.color"   class="btn bg-u w-8 h-8" />
      <input type="radio" name="color" value="v" v-model="config.color"   class="btn bg-v w-8 h-8" />
      <input type="radio" name="color" value="w" v-model="config.color"   class="btn bg-w w-8 h-8" />
      <input type="radio" name="color" value="x" v-model="config.color"   class="btn bg-x w-8 h-8" />
      <input type="radio" name="color" value="y" v-model="config.color"   class="btn bg-y w-8 h-8" />
      <input type="radio" name="color" value="z" v-model="config.color"   class="btn bg-z w-8 h-8" />
      <!-- <input type="radio" name="color" value="aa" v-model="config.color"   class="btn bg-aa w-8 h-8" />
      <input type="radio" name="color" value="bb" v-model="config.color"   class="btn bg-bb w-8 h-8" />
      <input type="radio" name="color" value="cc" v-model="config.color"   class="btn bg-cc w-8 h-8" />
      <input type="radio" name="color" value="dd" v-model="config.color"   class="btn bg-dd w-8 h-8" />
      <input type="radio" name="color" value="ee" v-model="config.color"   class="btn bg-ee w-8 h-8" />
      <input type="radio" name="color" value="ff" v-model="config.color"   class="btn bg-ff w-8 h-8" />
      <input type="radio" name="color" value="gg" v-model="config.color"   class="btn bg-gg w-8 h-8" />
      <input type="radio" name="color" value="hh" v-model="config.color"   class="btn bg-hh w-8 h-8" />
      <input type="radio" name="color" value="ii" v-model="config.color"   class="btn bg-ii w-8 h-8" />
      <input type="radio" name="color" value="jj" v-model="config.color"   class="btn bg-jj w-8 h-8" />
      <input type="radio" name="color" value="kk" v-model="config.color"   class="btn bg-kk w-8 h-8" />
      <input type="radio" name="color" value="ll" v-model="config.color"   class="btn bg-ll w-8 h-8" />
      <input type="radio" name="color" value="mm" v-model="config.color"   class="btn bg-mm w-8 h-8" />
      <input type="radio" name="color" value="nn" v-model="config.color"   class="btn bg-nn w-8 h-8" />
      <input type="radio" name="color" value="oo" v-model="config.color"   class="btn bg-oo w-8 h-8" />
      <input type="radio" name="color" value="pp" v-model="config.color"   class="btn bg-pp w-8 h-8" />
      <input type="radio" name="color" value="qq" v-model="config.color"   class="btn bg-qq w-8 h-8" />
      <input type="radio" name="color" value="rr" v-model="config.color"   class="btn bg-rr w-8 h-8" /> 
      <input type="radio" name="color" value="ss" v-model="config.color"   class="btn bg-ss w-8 h-8" /> 
      <input type="radio" name="color" value="tt" v-model="config.color"   class="btn bg-tt w-8 h-8" /> 
      <input type="radio" name="color" value="uu" v-model="config.color"   class="btn bg-uu w-8 h-8" /> 
      <input type="radio" name="color" value="vv" v-model="config.color"   class="btn bg-vv w-8 h-8" /> 
      <input type="radio" name="color" value="ww" v-model="config.color"   class="btn bg-ww w-8 h-8" /> 
      <input type="radio" name="color" value="xx" v-model="config.color"   class="btn bg-xx w-8 h-8" /> 
      <input type="radio" name="color" value="yy" v-model="config.color"   class="btn bg-yy w-8 h-8" /> 
      <input type="radio" name="color" value="zz" v-model="config.color"   class="btn bg-zz w-8 h-8" />  -->
      
    </div>
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
  </div>
</template>
