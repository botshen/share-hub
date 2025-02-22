<script lang="ts" setup>
import { ref } from 'vue'

interface ColorPreset {
  backgroundFillType: 'Linear' | 'Radial'
  backgroundStartColor: string
  backgroundEndColor: string
  backgroundAngle?: number
  backgroundPosition?: string
  backgroundRadius?: number
}

const selectedPresetIndex = ref(0)

  const presets: ColorPreset[] = [
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#FF7DB4",
        backgroundEndColor: "#654EA3",
        backgroundAngle: 45,
    },
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#8E2DE2",
        backgroundEndColor: "#4A00E0",
        backgroundAngle: 45,
    },
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#99F2C8",
        backgroundEndColor: "#1F4037",
        backgroundAngle: 45,
    },
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#F953C6",
        backgroundEndColor: "#B91D73",
        backgroundAngle: 45,
    },
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#91EAE4",
        backgroundEndColor: "#7F7FD5",
        backgroundAngle: 45,
    },
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#F5AF19",
        backgroundEndColor: "#F12711",
        backgroundAngle: 45,
    },
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#EAAFC8",
        backgroundEndColor: "#EC2F4B",
        backgroundAngle: 45,
    },

    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#00B4DB",
        backgroundEndColor: "#003357",
        backgroundAngle: 45,
    },
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#A8C0FF",
        backgroundEndColor: "#3F2B96",
        backgroundAngle: 90,
    },
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#DD1818",
        backgroundEndColor: "#380202",
        backgroundAngle: 135,
    },
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#DECBA4",
        backgroundEndColor: "#3E5151",
        backgroundAngle: 45,
    },
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#FC466B",
        backgroundEndColor: "#3F5EFB",
        backgroundAngle: 180,
    },
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#CCCFE2",
        backgroundEndColor: "#25242B",
        backgroundAngle: 180,
    },
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#68AEFF",
        backgroundEndColor: "#003EB7",
        backgroundAngle: 180,
    },
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#C9D6FF",
        backgroundEndColor: "#596AA1",
        backgroundAngle: 180,
    },
    {
        backgroundFillType: "Linear",
        backgroundStartColor: "#5C5C5C",
        backgroundEndColor: "#0F1015",
        backgroundAngle: 180,
    },
    {
        backgroundFillType: "Radial",
        backgroundStartColor: "#695BF8",
        backgroundEndColor: "#131308",
        backgroundPosition: "50%,0%",
    },
    {
        backgroundFillType: "Radial",
        backgroundStartColor: "#4d4d4d",
        backgroundEndColor: "#000000",
        backgroundPosition: "50%,0%",
    },
    {
        backgroundFillType: "Radial",
        backgroundStartColor: "#f5af19",
        backgroundEndColor: "#f12711",
        backgroundPosition: "50%,50%",
    },
    {
        backgroundFillType: "Radial",
        backgroundStartColor: "#1D6E47",
        backgroundEndColor: "#041B11",
        backgroundPosition: "50%,0%",
    },
    {
        backgroundFillType: "Radial",
        backgroundStartColor: "#ffffff",
        backgroundEndColor: "#666666",
        backgroundPosition: "50%,100%",
    },
    {
        backgroundFillType: "Radial",
        backgroundStartColor: "#d9f1f8",
        backgroundEndColor: "#002069",
        backgroundPosition: "50%,100%",
    },
    {
        backgroundFillType: "Radial",
        backgroundStartColor: "#f95356",
        backgroundEndColor: "#7e0000",
        backgroundPosition: "50%,50%",
    },
    {
        backgroundFillType: "Radial",
        backgroundStartColor: "#ffbb00",
        backgroundEndColor: "#ffe74b",
        backgroundPosition: "50%,0%",
    },
];

const emit = defineEmits<{
  (e: 'preset-selected', preset: ColorPreset): void
}>()

const selectPreset = (index: number) => {
  selectedPresetIndex.value = index
  emit('preset-selected', presets[index])
}

// 为每个预设生成唯一的渐变ID
const getGradientId = (index: number) => `gradient-${index}`

 
</script>
<template>
     <x-picker class="!w-[300px] !h-[150px] grid grid-cols-8 gap-2 p-2 border border-gray-200 rounded-lg" >
      <label
        v-for="(preset, index) in presets"
        :key="index"
        class="relative w-8 h-8 flex-shrink-0 rounded-lg cursor-pointer transition-all duration-200 hover:scale-110"
        :class="{ 'ring-2 ring-blue-500': selectedPresetIndex === index }"
      >
        <input
          type="radio"
          :name="'preset-color'"
          :value="index"
          class="absolute opacity-0 inset-0 w-full h-full cursor-pointer"
          :checked="selectedPresetIndex === index"
          @change="selectPreset(index)"
        >
        <svg
          class="w-full h-full"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              v-for="(preset, index) in presets"
              v-if="preset.backgroundFillType === 'Linear'"
              :id="getGradientId(index)"
              :gradientTransform="`rotate(${preset.backgroundAngle || 0}, 0.5, 0.5)`"
            >
              <stop offset="0%" :stop-color="preset.backgroundStartColor" />
              <stop offset="100%" :stop-color="preset.backgroundEndColor" />
            </linearGradient>
            
            <radialGradient
              v-for="(preset, index) in presets"
              v-if="preset.backgroundFillType === 'Radial'"
              :id="getGradientId(index)"
              cx="50%"
              cy="50%"
              r="100%"
            >
              <stop offset="0%" :stop-color="preset.backgroundStartColor" />
              <stop offset="100%" :stop-color="preset.backgroundEndColor" />
            </radialGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="40"
            height="40"
            :rx="preset.backgroundRadius || 8"
            :fill="`url(#${getGradientId(index)})`"
          />
        </svg>
      </label>
    </x-picker>
 </template>

 