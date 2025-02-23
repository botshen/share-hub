<script lang="ts" setup>
import { useOptionsStore } from "./use-options-store";
import ColorPicker, { ColorPreset } from "@/components/ColorPicker.vue";
const { todos, addTodo, clearAllTodos, getTodos, deleteTodo } = useOptionsStore();

onMounted(async () => {
  await getTodos();
});
onMessage("openOptionsPage", async () => {
  await getTodos();
});

const handlePresetSelect = (preset: ColorPreset) => {
  console.log("选中的预设:", preset);
};

const handleSelectTodo = (todoId: number) => {
  currentTodoId.value = todoId;
};
const handleDelete = (todoId: number) => {
  deleteTodo(todoId);
};
const currentTodoId = ref<number | null>(null);
const currentTodo = computed(() => {
  if(!todos.value) return null
  console.log('todos.value',todos.value)
  if(!currentTodoId.value) return todos.value?.[0]
  return todos.value?.find((todo) => todo.id === currentTodoId.value);
});
</script>

<template>
  <div class=" h-screen flex bg-cover px-[100px]"> 

    <ul class="list bg-base-100 rounded-box shadow-md shrink-0">
      <li v-for="todo in todos" :key="todo.id" class="  list-row ">
        <div><img class="size-10 rounded-box" :src="todo.avatarUrl"/>    </div>
    <div>
      <div>{{ todo.author }}</div>
      <div class="text-xs uppercase font-semibold opacity-60">{{ todo.title }}</div>
    </div>
    <button class="btn btn-square btn-ghost" @click="handleSelectTodo(todo.id)">
      <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
    </button>
    <button class="btn btn-square btn-ghost" @click="handleDelete(todo.id)">
      <svg t="1740274258800" class="icon size-[1.2em]" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7931" width="200" height="200"><path d="M849.292759 73.484087H634.508149v-13.831973A59.650385 59.650385 0 0 0 574.46874 0.001729H449.462282a59.650385 59.650385 0 0 0-59.650385 59.650385v13.831973H174.595038A62.373554 62.373554 0 0 0 111.48666 133.566721a60.947132 60.947132 0 0 0 60.947132 61.89808h679.063438a60.947132 60.947132 0 0 0 60.947132-61.89808 62.373554 62.373554 0 0 0-63.151603-60.082634" fill="#FF9000" p-id="7932"></path><path d="M812.032881 233.632402H211.854916A72.747534 72.747534 0 0 0 139.496406 313.728173l62.546454 567.845727a158.332869 158.332869 0 0 0 157.511595 142.382875h304.735662a158.332869 158.332869 0 0 0 157.511595-142.382875l62.41678-567.845727a72.747534 72.747534 0 0 0-72.358511-80.095771m-363.521547 536.291539a42.662993 42.662993 0 0 1-42.662993 42.662993h-6.656637a42.662993 42.662993 0 0 1-42.662992-42.662993v-330.843511a42.662993 42.662993 0 0 1 42.662992-42.662992h6.656637a42.662993 42.662993 0 0 1 42.662993 42.662992z m219.236776 0a42.662993 42.662993 0 0 1-42.662992 42.662993h-6.656637a42.662993 42.662993 0 0 1-42.662993-42.662993v-330.843511a42.662993 42.662993 0 0 1 42.662993-42.662992h6.613412a42.662993 42.662993 0 0 1 42.662992 42.662992z" fill="#F61818" p-id="7933"></path></svg>
      </button> 
      </li>
    </ul>
    <main class="grow w-full">
      <div class="flex items-center gap-2">
        <img
          :src="currentTodo?.avatarUrl"
          class="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
        />
        <span class="text-lg">{{ currentTodo?.author }}</span>
      </div>
      <x-title class="text-2xl font-bold block">{{
        currentTodo?.title
      }}</x-title>
      <div
        class="text-sm leading-relaxed mt-4 w-full max-w-[800px] break-words whitespace-pre-wrap overflow-wrap-anywhere"
        :contentEditable="true"
        :suppressContentEditableWarning="true"
        :innerHTML="currentTodo?.postContent"
      />
    </main>
    <ColorPicker class="shrink-0" @preset-selected="handlePresetSelect" />

  </div>
</template>
