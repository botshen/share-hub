<script lang="ts" setup>
import { sharePostContent } from './get-post/v2ex';

  const onClick = () => {
     sharePostContent()
  }
  </script>

<template>
  <div @click="onClick" class="xxx">
   S
  </div>
</template>

<style scoped>
.xxx {
  position: fixed;
  right: 0;
  top: 50%;
  z-index: 9999999;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 24px 0 0 24px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: visible !important;
}

.xxx:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  width: 56px;
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
  transform: translateY(-50%) translateX(-4px);
}
 
</style>