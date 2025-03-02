<script lang="ts" setup>
import { ColorPreset, transformObjToTailwindcss } from "@/utils/post-config";
import { useOptionsStore } from "../use-options-store";
const {
  currentTodo,
  config,
  isCopying,
  isDownloading,
  successInfoVisible,
  bgClass,
} = useOptionsStore();
import { generateImage } from "@/utils/image";
// 定义配置选项
const configOptions = {
  color: [
    "b",
    "default",
    "a",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ],
  width: ["sm", "md", "lg", "xl", "full"],
  padding: ["sm", "md", "lg", "xl"],
  format: ["png", "jpeg", "svg", "webp"],
  fontSize: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
  imageQuality: ["1", "2", "3", "4"],
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
    throw new Error("无效的数据URL格式");
  }
  const [, mimeType] = matches;
  const blob = await fetch(dataUrl).then((res) => res.blob());
  await navigator.clipboard.write([
    new ClipboardItem({
      [mimeType]: blob,
    }),
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
  a.download = `${currentTodo.value?.title ?? "image"}${new Date().toISOString().slice(0, 10)}_${new Date().toLocaleTimeString().replace(/:/g, "-")}`;
  a.click();
  isDownloading.value = false;
};
const handleReadMode = () => {
  config.value.width = "full";
  config.value.padding = "sm";
  config.value.fontSize = "lg";
};
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
            { 'ring-2 ring-blue-500': config.color === color },
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
              'bg-blue-500 text-white border-blue-500': config[key] === value,
            }"
          />
        </div>
      </template>
    </template>
    <div class="flex gap-2 items-center mt-2">
      <button
        class="btn bg-[#0967C2] text-white border-[#0059b3]"
        @click="handleDownload"
      >
        <span v-if="isDownloading" class="loading loading-spinner"></span>
        Download
      </button>
      <button
        class="btn bg-[#622069] text-white border-[#591660]"
        @click="handleCopy"
      >
        <span
          v-if="isCopying && !isDownloading"
          class="loading loading-spinner"
        ></span>
        Copy
      </button>
      <button
        @click="handleReadMode"
        class="btn bg-[#FEE502] text-[#181600] border-[#f1d800]"
      >
        <svg
          aria-label="Kakao logo"
          width="16"
          height="16"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#181600"
            d="M255.5 48C299.345 48 339.897 56.5332 377.156 73.5996C414.415 90.666 443.871 113.873 465.522 143.22C487.174 172.566 498 204.577 498 239.252C498 273.926 487.174 305.982 465.522 335.42C443.871 364.857 414.46 388.109 377.291 405.175C340.122 422.241 299.525 430.775 255.5 430.775C241.607 430.775 227.262 429.781 212.467 427.795C148.233 472.402 114.042 494.977 109.892 495.518C107.907 496.241 106.012 496.15 104.208 495.248C103.486 494.706 102.945 493.983 102.584 493.08C102.223 492.177 102.043 491.365 102.043 490.642V489.559C103.126 482.515 111.335 453.169 126.672 401.518C91.8486 384.181 64.1974 361.2 43.7185 332.575C23.2395 303.951 13 272.843 13 239.252C13 204.577 23.8259 172.566 45.4777 143.22C67.1295 113.873 96.5849 90.666 133.844 73.5996C171.103 56.5332 211.655 48 255.5 48Z"
          ></path>
        </svg>
        Read Mode
      </button>
    </div>
  </div>
</template>
