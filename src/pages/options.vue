<script lang="ts" setup>
import { generateImage } from "@/utils/image";
import { useOptionsStore } from "./use-options-store";
import ColorPicker, { ColorPreset } from "@/components/ColorPicker.vue";
const { todos, addTodo, clearAllTodos, getTodos, deleteTodo } =
  useOptionsStore();

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
  if (!todos.value) return null;
  console.log("todos.value", todos.value);
  if (!currentTodoId.value) return todos.value?.[0];
  return todos.value?.find((todo) => todo.id === currentTodoId.value);
});

// 添加配置选项的响应式变量
const config = ref({
  width: 'md',
  padding: 'md',
  format: 'png',
  fontSize: 'md',
  imageQuality: '2'
});

const paddingMap = {
  sm: '10px',
  md: '20px',
  lg: '30px',
  xl: '40px',
}

const handleDownload = async () => {
  isDownloading.value = true;
  const dataUrl = await generateImage({
    format: config.value.format,
    width: 448,
    height: 600,
    fontFamily: "Arial",
    scale: parseInt(config.value.imageQuality),
  });
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${currentTodo.value?.title ?? "image"}${new Date().toISOString().slice(0,10)}_${new Date().toLocaleTimeString().replace(/:/g, '-')}`;
  a.click();
  isDownloading.value = false;
};
const isCopying = ref(false);
const isDownloading = ref(false);
const handleCopy = async () => {
  isCopying.value = true;
  const dataUrl = await generateImage({
    format: config.value.format,
    width: 448,
    height: 600,
    fontFamily: "Arial",
    scale: parseInt(config.value.imageQuality),
  });
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    throw new Error('无效的数据URL格式');
  }
  const [, mimeType] = matches;
  const blob = await fetch(dataUrl).then((res) => res.blob());
  await navigator.clipboard.write([
    new ClipboardItem({
      [mimeType]: blob
    })
  ]);
 
  isCopying.value = false;
  successInfo.value = true;
  setTimeout(() => {
    successInfo.value = false;
  }, 2000);
};
const successInfo = ref(false);
</script>

<template>
  <div v-if="successInfo" class="toast toast-end"> 
  <div class="alert alert-success">
    <span>successfully.</span>
  </div>
</div>
  <div class="flex bg-cover px-[200px]">
    <ul class="list bg-base-100 rounded-box shadow-md shrink-0">
      <li v-for="todo in todos" :key="todo.id" class="list-row">
        <div><img class="size-10 rounded-box" :src="todo.avatarUrl" /></div>
        <div>
          <div>{{ todo.author }}</div>
          <div class="text-xs uppercase font-semibold opacity-60">
            {{ todo.title }}
          </div>
        </div>
        <button class="btn btn-square btn-ghost" @click="handleSelectTodo(todo.id)">
          <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor">
              <path d="M6 3L20 12 6 21 6 3z"></path>
            </g>
          </svg>
        </button>
        <button class="btn btn-square btn-ghost" @click="handleDelete(todo.id)">
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
      </li>
    </ul>
    <main class="mx-auto w-[448px] bg-red-200   rounded-box p-2 m-2  " id="card">
      <header class="flex items-center gap-2 p-2">
        <img :src="currentTodo?.avatarUrl" class="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" />
        <span class="text-lg">{{ currentTodo?.author }}</span>
      </header>
      <x-title class="text-2xl font-bold block my-2 p-2">{{
        currentTodo?.title
        }}</x-title>
      <div class="text-base p-2 cursor-pointer whitespace-pre-wrap break-words  " :contentEditable="true"
        :innerHTML="currentTodo?.postContent" />
      <x-comment-list v-for="(comment, index) in currentTodo?.comments" :key="comment.id">
        <x-comment class="px-2 block">
          <div class="divider text-sm h-1 font-bold">
            {{ index === 0 ? "精选评论" : "" }}
          </div>
          <div class="flex items-center gap-2">
            <img :src="comment.avatarUrl" alt="头像" class="w-8 h-8 rounded-full mr-1 mb-2 border border-gray-400" />
            <span class="text-sm font-bold mb-1">{{ comment.author }}</span>
          </div>
          <div class="text-sm break-words whitespace-pre-wrap overflow-wrap-anywhere" v-html="comment.content" />
        </x-comment>
      </x-comment-list>
    </main>
    <x-action-bar class="shrink-0 flex flex-col w-[300px] ">
      <ColorPicker class="shrink-0" @preset-selected="handlePresetSelect" />
      <legend class="fieldset-legend">WIDTH</legend>
      <div class="flex gap-2">
        <input type="radio" name="width" value="sm" v-model="config.width" aria-label="sm" class="btn" />
        <input type="radio" name="width" value="md" v-model="config.width" aria-label="md" class="btn" />
        <input type="radio" name="width" value="lg" v-model="config.width" aria-label="lg" class="btn" />
        <input type="radio" name="width" value="xl" v-model="config.width" aria-label="xl" class="btn" />
      </div>
      <legend class="fieldset-legend">PADDING</legend>
      <div class="flex gap-2">
        <input type="radio" name="padding" value="sm" v-model="config.padding" aria-label="sm" class="btn" />
        <input type="radio" name="padding" value="md" v-model="config.padding" aria-label="md" class="btn" />
        <input type="radio" name="padding" value="lg" v-model="config.padding" aria-label="lg" class="btn" />
        <input type="radio" name="padding" value="xl" v-model="config.padding" aria-label="xl" class="btn" />
      </div>
      <legend class="fieldset-legend">FORMAT</legend>
      <div class="flex gap-2">
        <input type="radio" name="format" value="png" v-model="config.format" aria-label="png" class="btn" />
        <input type="radio" name="format" value="jpeg" v-model="config.format" aria-label="jpeg" class="btn" />
        <input type="radio" name="format" value="svg" v-model="config.format" aria-label="svg" class="btn" />
        <input type="radio" name="format" value="md" v-model="config.format" aria-label="md" class="btn" />
      </div>
      <legend class="fieldset-legend">FONT SIZE</legend>
      <div class="flex gap-2 flex-wrap">
        <input type="radio" name="fontSize" value="xs" v-model="config.fontSize" aria-label="xs" class="btn" />
        <input type="radio" name="fontSize" value="sm" v-model="config.fontSize" aria-label="sm" class="btn" />
        <input type="radio" name="fontSize" value="md" v-model="config.fontSize" aria-label="md" class="btn" />
        <input type="radio" name="fontSize" value="lg" v-model="config.fontSize" aria-label="lg" class="btn" />
        <input type="radio" name="fontSize" value="xl" v-model="config.fontSize" aria-label="xl" class="btn" />
        <input type="radio" name="fontSize" value="2xl" v-model="config.fontSize" aria-label="2xl" class="btn" />
        <input type="radio" name="fontSize" value="3xl" v-model="config.fontSize" aria-label="3xl" class="btn" />
      </div>
      <legend class="fieldset-legend">IMAGE QUALITY</legend>
      <div class="flex gap-2">
        <input type="radio" name="imageQuality" value="1" v-model="config.imageQuality" aria-label="1x" class="btn" />
        <input type="radio" name="imageQuality" value="2" v-model="config.imageQuality" aria-label="2x" class="btn" />
        <input type="radio" name="imageQuality" value="3" v-model="config.imageQuality" aria-label="3x" class="btn" />
        <input type="radio" name="imageQuality" value="4" v-model="config.imageQuality" aria-label="4x" class="btn" />
      </div>
      <button class="btn btn-block my-2" @click="handleDownload">
        <span v-if="isDownloading" class="loading loading-spinner">
        </span>
        Download</button>
      <button class="btn btn-block" @click="handleCopy">
        <span v-if="isCopying" class="loading loading-spinner">
        </span>
        Copy</button>
    </x-action-bar>
  </div>
</template>
