import { Key } from "@/utils/cache";
import { createCachedFn } from "@/utils/cache";
import { ref } from "vue";
import { getTodosRepo } from "@/utils/service";
import { ColorPreset, transformObjToTailwindcss } from "@/utils/post-config";
export const presetsMap: ColorPreset[] = [
  {
    backgroundStartColor: "#FFF8E1",
    backgroundEndColor: "#FFE082",
  },
  {
    backgroundStartColor: "#FF7DB4",
    backgroundEndColor: "#654EA3",
  },
  {
    backgroundStartColor: "#8E2DE2",
    backgroundEndColor: "#4A00E0",

  },
  {
    backgroundStartColor: "#99F2C8",
    backgroundEndColor: "#1F4037",

  },

  {
    backgroundStartColor: "#F5AF19",
    backgroundEndColor: "#F12711",

  },
  {
    backgroundStartColor: "#A8C0FF",
    backgroundEndColor: "#3F2B96",

  }
];
export const useOptionsStore = createCachedFn((cacheKey?: Key) => {
  const todosRepo = getTodosRepo();
  const todos = ref<any[]>([]);
  const successInfoVisible = ref(false);
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
  const currentTodoId = ref<number | null | string>(null);
  const currentTodo = ref<any>(null);
  const getTodos = async () => {
    const result = await todosRepo.getAll();
    console.log("result", result);
    todos.value = result
    console.log('currentTodoId', currentTodoId.value)
    console.log('todos', todos.value)
    if (todos.value.length > 0 && currentTodoId.value) {
      currentTodo.value = todos.value.find(todo => todo.id === currentTodoId.value);
    } else {
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
  const handleSelectTodo = async (todoId: number) => {
    console.log('todoId', todoId)
    currentTodoId.value = todoId;
    await getTodos();
  };
  const handleDelete = (todoId: number) => {
    deleteTodo(todoId);
  };
  const isCopying = ref(false);
  const isDownloading = ref(false);
  const onlyEditorVisible = computed(() => {
    return !(isCopying.value || isDownloading.value)
  })
  const config = ref({
    width: 'md',
    padding: 'md',
    format: 'png',
    fontSize: 'md',
    imageQuality: '2',
    color: 't',
    customCSS: ''
  });

  const bgClass = ref(transformObjToTailwindcss(presetsMap[0]))



  return {
    todos,
    getTodos,
    addTodo,
    clearAllTodos,
    deleteTodo,
    currentTodoId,
    currentTodo,
    handleSelectTodo,
    handleDelete,
    successInfoVisible,
    isCopying,
    isDownloading,
    onlyEditorVisible,
    config,
    bgClass,
    todosRepo
  };
});
