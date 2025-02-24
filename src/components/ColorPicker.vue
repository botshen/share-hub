<script lang="ts" setup>
import { ColorPreset, presets } from '@/utils/post-config';
import { ref } from 'vue'



const selectedPresetIndex = ref(0)

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
  <x-picker class="!w-[300px] !h-[150px] grid grid-cols-8 gap-2 p-2 border border-gray-200 rounded-lg">
    <label v-for="(preset, index) in presets" :key="index"
      class="relative w-8 h-8 flex-shrink-0 rounded-lg cursor-pointer transition-all duration-200 hover:scale-110"
      :class="{ 'ring-2 ring-blue-500': selectedPresetIndex === index }">
      <input type="radio" :name="'preset-color'" :value="index"
        class="absolute opacity-0 inset-0 w-full h-full cursor-pointer" :checked="selectedPresetIndex === index"
        @change="selectPreset(index)">
      <svg class="w-full h-full" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient v-for="(preset, index) in presets" v-if="preset.backgroundFillType === 'Linear'"
            :id="getGradientId(index)" :gradientTransform="`rotate(${preset.backgroundAngle || 0}, 0.5, 0.5)`">
            <stop offset="0%" :stop-color="preset.backgroundStartColor" />
            <stop offset="100%" :stop-color="preset.backgroundEndColor" />
          </linearGradient>

          <radialGradient v-for="(preset, index) in presets" v-if="preset.backgroundFillType === 'Radial'"
            :id="getGradientId(index)" cx="50%" cy="50%" r="100%">
            <stop offset="0%" :stop-color="preset.backgroundStartColor" />
            <stop offset="100%" :stop-color="preset.backgroundEndColor" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="40" height="40" :rx="preset.backgroundRadius || 8"
          :fill="`url(#${getGradientId(index)})`" />
      </svg>
    </label>
  </x-picker>
</template>