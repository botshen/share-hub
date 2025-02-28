<script lang="ts" setup>
 type LogoSource = 'v2ex' | 'reddit' | 'hacknews'

 defineProps<{
  source: LogoSource
 }>()
 const logoMap: Record<LogoSource, string> = {
  v2ex: 'v2ex.svg',
  reddit: 'reddit.svg',
  hacknews: 'hacker-news.svg',
 }
</script>
<template>
    
     <img :src="`/svg/${logoMap[source]}`" class="size-8 opacity-90" />
   
</template>
