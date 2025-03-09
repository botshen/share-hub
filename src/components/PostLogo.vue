<script lang="ts" setup>
type LogoSource = 'v2ex' | 'reddit' | 'hacknews' | 'x'

const props = defineProps<{
     source: LogoSource
     url: string
}>()
const logoMap: Record<LogoSource, string> = {
     v2ex: 'v2ex.svg',
     reddit: 'reddit.svg',
     hacknews: 'hacker-news.svg',
     x: 'x.svg'
}
const handleClick = () => {
     window.open(props.url, '_blank')
}
</script>
<template>
     <img @click="handleClick" :src="`/svg/${logoMap[source]}`" class="size-8 opacity-90 cursor-pointer" />
</template>
