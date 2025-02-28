<script lang="ts" setup>
import { useOptionsStore } from "../use-options-store";
const { todos, handleSelectTodo, handleDelete } = useOptionsStore();
</script>
<template>
  <ul class="list bg-base-100 rounded-box shadow-md shrink-0 h-auto w-[300px]">
    <li v-for="todo in todos" :key="todo.id">
      <div @click="handleSelectTodo(todo.id)" class="list-row cursor-pointer flex items-center gap-4 p-2">
        <div class="mask mask-squircle w-10 h-10 flex-shrink-0">
          <img :src="todo.avatarUrl" />
        </div>
        <div class="flex-grow min-w-0">
          <div>{{ todo.author }}</div>
          <div class="text-xs uppercase font-semibold opacity-60 truncate max-w-[200px]">
            {{ todo.title }}
          </div>
        </div>

        <button v-if="todos.length > 1" class="btn btn-square btn-ghost flex-shrink-0" @click="handleDelete(todo.id)">
          <svg t="1740274258800" class="icon size-[1.2em]" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="7931" width="200" height="200">
            <path
              d="M849.292759 73.484087H634.508149v-13.831973A59.650385 59.650385 0 0 0 574.46874 0.001729H449.462282a59.650385 59.650385 0 0 0-59.650385 59.650385v13.831973H174.595038A62.373554 62.373554 0 0 0 111.48666 133.566721a60.947132 60.947132 0 0 0 60.947132 61.89808h679.063438a60.947132 60.947132 0 0 0 60.947132-61.89808 62.373554 62.373554 0 0 0-63.151603-60.082634"
              fill="#FF9000" p-id="7932"></path>
            <path
              d="M812.032881 233.632402H211.854916A72.747534 72.747534 0 0 0 139.496406 313.728173l62.546454 567.845727a158.332869 158.332869 0 0 0 157.511595 142.382875h304.735662a158.332869 158.332869 0 0 0 157.511595-142.382875l62.41678-567.845727a72.747534 72.747534 0 0 0-72.358511-80.095771m-363.521547 536.291539a42.662993 42.662993 0 0 1-42.662993 42.662993h-6.656637a42.662993 42.662993 0 0 1-42.662992-42.662993v-330.843511a42.662993 42.662993 0 0 1 42.662992-42.662992h6.656637a42.662993 42.662993 0 0 1 42.662993 42.662992z m219.236776 0a42.662993 42.662993 0 0 1-42.662992 42.662993h-6.656637a42.662993 42.662993 0 0 1-42.662993-42.662993v-330.843511a42.662993 42.662993 0 0 1 42.662993-42.662992h6.613412a42.662993 42.662993 0 0 1 42.662992 42.662992z"
              fill="#F61818" p-id="7933"></path>
          </svg>
        </button>
      </div>
    </li>
  </ul>
</template>
