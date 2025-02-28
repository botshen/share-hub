<script lang="ts" setup>
 type LogoSource = 'v2ex' | 'reddit'

 defineProps<{
  source: LogoSource
 }>()
 const logoMap: Record<LogoSource, string> = {
  v2ex: 'v2ex.svg',
  reddit: 'reddit.svg',
 }
</script>
<template>
    
     <img :src="`/${logoMap[source]}`" class="size-8 opacity-90" />
   
</template>
