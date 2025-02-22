<script lang="ts" setup>
import { useOptionsStore } from "./use-options-store";
import ColorPicker from "@/components/ColorPicker.vue";
const { todos, addTodo, clearAllTodos, getTodos } = useOptionsStore();

onMounted(async () => {
  await getTodos();
});
onMessage("openOptionsPage", async () => {
  await getTodos();
});

const handlePresetSelect = (preset) => {
  console.log('选中的预设:', preset)
}
 
const currentTodo = computed(() => {
  return todos.value?.[0]
})
</script>

<template>
  <div class="bg-[#39383b] h-screen flex">
    <button class="btn btn-primary" @click="addTodo">add todo</button>
    <button class="btn btn-primary" @click="clearAllTodos">
      clear all todos
    </button>

    <ColorPicker @preset-selected="handlePresetSelect" />
    <ul>
      <li v-for="todo in todos" :key="todo.id" class="text-white">
        id: {{ todo.id }} - title: {{ todo.title }}
      </li>
    </ul>
    <main class="flex-1    text-white">
      <div class="flex items-center gap-2">
        <img :src="currentTodo?.avatarUrl" class="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" />
        <span class="text-lg ">{{ currentTodo?.author }}</span>
      </div>
      <x-title class="text-2xl font-bold block">{{ currentTodo?.title }}</x-title>

      <div
          class="text-lg leading-relaxed mt-4"
          :contentEditable="true"
          :suppressContentEditableWarning="true"
          :innerHTML="currentTodo?.postContent"
        />
    </main>
  </div>
</template>
