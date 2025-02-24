<script lang="ts" setup>
import { generateImage } from "@/utils/image";
import { useOptionsStore } from "./use-options-store";
import ColorPicker, { ColorPreset } from "@/components/ColorPicker.vue";
import { onMessage } from "@/utils/message";

const { todos, getTodos, deleteTodo, currentTodoId } =
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

const handleSelectTodo = async (todoId: number) => {
  currentTodoId.value = todoId;
  selectedComments.value = [];
  await getTodos();
};
const handleDelete = (todoId: number) => {
  deleteTodo(todoId);
};
const currentTodo = computed(() => {
  if (!todos.value) return null;
  console.log("todos.value", todos.value);
  console.log('currentTodoId', currentTodoId)
  if (!currentTodoId.value) return todos.value?.[0];
  return todos.value?.find((todo) => todo.id === currentTodoId.value);
});

// 添加配置选项的响应式变量
const paddingMap = {
  sm: '10px',
  md: '20px',
  lg: '30px',
  xl: '40px',
} as const;

const widthMap = {
  sm: '300px',
  md: '400px',
  lg: '600px',
  xl: '800px',
} as const;
const titleFontSizeMap = {
  xs: '20px',
  sm: '24px',
  md: '28px',
  lg: '32px',
  xl: '36px',
  '2xl': '40px',
  '3xl': '48px',
} as const;
const postFontSizeMap = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
} as const;



type WidthSize = keyof typeof widthMap;
type FontSize = keyof typeof postFontSizeMap;
type TitleFontSize = keyof typeof titleFontSizeMap;
const config = ref({
  width: 'md' as WidthSize,
  padding: 'md',
  format: 'png',
  fontSize: 'md' as FontSize,
  imageQuality: '2'
});

const detailCss = (newVal: typeof config.value) => {
  console.log("config", newVal);
  const card = document.getElementById('card')
  if (card) {
    card.style.width = widthMap[newVal.width as WidthSize]
    card.style.fontSize = postFontSizeMap[newVal.fontSize as FontSize]
  }
  const comments = document.querySelectorAll('#comment')
  comments.forEach(comment => {
    if (comment instanceof HTMLElement) {
      comment.style.fontSize = postFontSizeMap[newVal.fontSize as FontSize]
    }
  })
  const title = document.getElementById('title')
  if (title) {
    title.style.fontSize = titleFontSizeMap[newVal.fontSize as TitleFontSize]
  }

}
watch(config, (newVal) => {
  detailCss(newVal)
}, { deep: true, immediate: true });

onMounted(() => {
  console.log("mounted");
  detailCss(config.value)
})

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
  a.download = `${currentTodo.value?.title ?? "image"}${new Date().toISOString().slice(0, 10)}_${new Date().toLocaleTimeString().replace(/:/g, '-')}`;
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

// 1. 添加状态管理
const selectedComments = ref<Comment[]>([]);

</script>

<template>
  <div v-if="successInfo" class="toast toast-end">
    <div class="alert alert-success">
      <span>successfully.</span>
    </div>
  </div>
  <div class="flex bg-cover px-[100px] mt-2">
    <ul class="list bg-base-100 rounded-box shadow-md shrink-0 h-auto w-[300px]">
      <li v-for="todo in todos" :key="todo.id">
        <div @click="handleSelectTodo(todo.id)" class="list-row cursor-pointer">
          <div class="mask mask-squircle w-10 h-10">
            <img :src="todo.avatarUrl" />
          </div>
          <div>
            <div>{{ todo.author }}</div>
            <div class="text-xs uppercase font-semibold opacity-60">
              {{ todo.title }}
            </div>
          </div>

          <button v-if="todos.length > 1" class="btn btn-square btn-ghost" @click="handleDelete(todo.id)">
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
    <main class="mx-auto bg-white w-[448px] border rounded-box p-4 py-6 m-4" id="card">
      <header class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <div class="avatar">
            <div class="mask mask-squircle w-10">
              <img :src="currentTodo?.avatarUrl" />
            </div>
          </div>
          <span class="text-lg">{{ currentTodo?.author }}</span>
        </div>
        <div class="flex items-center gap-2 text-gray-500">
          V2ex
          <svg t="1740317552775" class="icon size-8 opacity-30" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="2627" width="200" height="200">
            <path
              d="M46.08 47.616c-6.656 8.192-10.24 62.976-10.24 179.712v167.424h542.72l44.544 52.736c24.576 28.672 44.544 58.88 44.544 67.584 0 8.192-20.48 37.888-45.056 67.072l-45.056 51.712H35.84v160.768c0 90.624 3.584 168.448 8.704 179.712 8.704 17.92 21.504 18.944 298.496 18.944 158.72 0 295.424-3.072 302.08-6.144 7.68-3.072 92.16-104.96 188.416-224.256 149.504-186.368 175.104-222.208 175.104-248.32s-18.944-54.784-116.736-177.664C827.904 256 746.496 155.648 710.656 112.64L646.144 35.84H351.744C133.12 35.84 53.76 38.912 46.08 47.616z"
              fill="#707070" p-id="2628"></path>
          </svg>
        </div>
      </header>
      <x-title class="font-bold block my-2 p-2" id="title">{{
        currentTodo?.title
        }}</x-title>
      <div class="  p-2 cursor-pointer whitespace-pre-wrap break-words" :contentEditable="true"
        :innerHTML="currentTodo?.postContent" />
      <div class="comments-container" v-if="!(isCopying || isDownloading)">
        <div class="selected-zone">
          <div class="selected-zone-header">
            <span class="text-lg font-bold">评论</span>
          </div>
          <div class="comments-list">
            <div v-for="comment in currentTodo?.comments" :key="comment.id">
              <div class="divider h-1"></div>
              <div class="comment-item">
                <x-comment id="comment" class="px-2 block">
                  <div class="flex items-center gap-2">
                    <div class="mask mask-squircle w-8">
                      <img :src="comment.avatarUrl" />
                    </div>
                    <span class="font-bold">{{ comment.author }}</span>
                  </div>
                  <div class="break-words whitespace-pre-wrap overflow-wrap-anywhere ml-10 mt-1"
                    v-html="comment.content" />
                </x-comment>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="text-center text-gray-500 bg-gray-100 p-2 mt-4 mx-3 rounded-box text-sm">
        本图片由 ShareHub 浏览器插件生成
      </footer>
    </main>
    <x-action-bar class="shrink-0 flex flex-col w-[300px] ">
      <!-- <ColorPicker class="shrink-0" @preset-selected="handlePresetSelect" /> -->
      <legend class="fieldset-legend">WIDTH</legend>
      <div class="flex gap-2">
        <input type="radio" name="width" value="sm" v-model="config.width" aria-label="sm" class="btn" />
        <input type="radio" name="width" value="md" v-model="config.width" aria-label="md" class="btn" />
        <input type="radio" name="width" value="lg" v-model="config.width" aria-label="lg" class="btn" />
        <input type="radio" name="width" value="xl" v-model="config.width" aria-label="xl" class="btn" />
      </div>
      <!-- <legend class="fieldset-legend">PADDING</legend>
      <div class="flex gap-2">
        <input type="radio" name="padding" value="sm" v-model="config.padding" aria-label="sm" class="btn" />
        <input type="radio" name="padding" value="md" v-model="config.padding" aria-label="md" class="btn" />
        <input type="radio" name="padding" value="lg" v-model="config.padding" aria-label="lg" class="btn" />
        <input type="radio" name="padding" value="xl" v-model="config.padding" aria-label="xl" class="btn" />
      </div> -->
      <legend class="fieldset-legend">FORMAT</legend>
      <div class="flex gap-2">
        <input type="radio" name="format" value="png" v-model="config.format" aria-label="png" class="btn" />
        <input type="radio" name="format" value="jpeg" v-model="config.format" aria-label="jpeg" class="btn" />
        <input type="radio" name="format" value="svg" v-model="config.format" aria-label="svg" class="btn" />
        <input type="radio" name="format" value="webp" v-model="config.format" aria-label="webp" class="btn" />
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
        <input type="radio" name="imageQuality" value="1" v-model="config.imageQuality" aria-label="normal" class="btn" />
        <input type="radio" name="imageQuality" value="2" v-model="config.imageQuality" aria-label="high" class="btn" />
        <input type="radio" name="imageQuality" value="3" v-model="config.imageQuality" aria-label="super" class="btn" />
        <input type="radio" name="imageQuality" value="4" v-model="config.imageQuality" aria-label="ultra" class="btn" />
      </div>
      <button class="btn btn-block my-2" @click="handleDownload">
        <span v-if="isDownloading" class="loading loading-spinner">
        </span>
        Download</button>
      <button class="btn btn-block" @click="handleCopy">
        <span v-if="isCopying && !isDownloading" class="loading loading-spinner">
        </span>
        Copy</button>
    </x-action-bar>
  </div>
</template>
 
