<script lang="ts" setup>
import { getTodosRepo } from '@/utils/service';
import { ref } from 'vue';

const handleMessage = (message: any) => {
  console.log("message", message);
};
browser.runtime.onMessage.addListener(handleMessage);

const todosRepo = getTodosRepo();

const todos = ref<any[]>([]);

const addTodo = () => {
  todosRepo.create({   title: "test", completed: false });
  getTodos();
};

const getTodos = () => {
  todosRepo.getAll().then((result) => {
    todos.value = result;
    console.log(todos.value);
  });
};
const clearAllTodos = () => {
  todosRepo.clear();
  getTodos();
};

// 页面加载时获取todos
getTodos();

</script>

<template>
  <div>
    <h1 class="text-6xl font-bold text-red-600">Options</h1>
    <button class="btn btn-primary" @click="addTodo"> add todo </button>
    <button class="btn btn-primary" @click="clearAllTodos"> clear all todos </button>
  </div>
  <div>
    <h1>Todos</h1>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        {{ todo.title }} - {{ todo.completed ? '已完成' : '未完成' }}
      </li>
    </ul>
  </div>
</template>
