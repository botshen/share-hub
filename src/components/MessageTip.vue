<script lang="ts" setup>
import { useOptionsStore } from '@/pages/use-options-store';

 const {successInfoVisible} = useOptionsStore()
</script>
<template>
  <div v-if="successInfoVisible" class="toast toast-end">
    <div class="alert alert-success">
      <span>successfully.</span>
    </div>
  </div>
</template>
