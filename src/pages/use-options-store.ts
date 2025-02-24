import { Key } from "@/utils/cache";
import { createCachedFn } from "@/utils/cache";
import { ref } from "vue";
import { getTodosRepo } from "@/utils/service";

export const useOptionsStore = createCachedFn((cacheKey?: Key) => {
  const todosRepo = getTodosRepo();
  const todos = ref<any[]>([]);

  const addTodo = () => {
    todosRepo.create({
      title: "test",
      postContent: "test",
      url: "test",
      author: "test",
      avatarUrl: "test",
      comments: [],
      postscripts: [],
    });
    getTodos();
  };
  const currentTodoId = ref<number | null>(null);
  const currentTodo = ref<any>(null);
  const getTodos = async () => {
    const result = await todosRepo.getAll();
    console.log("result", result);
    todos.value = result.sort((a, b) => b.id - a.id);
    if (todos.value.length > 0) {
      currentTodo.value = todos.value[0];
    }
  };
  const clearAllTodos = () => {
    todosRepo.clear();
    getTodos();
  };
  const deleteTodo = (todoId: number) => {
    todosRepo.delete(todoId);
    getTodos();
  };

  return {
    todos,
    getTodos,
    addTodo,
    clearAllTodos,
    deleteTodo,
    currentTodoId,
    currentTodo,
  };
});
