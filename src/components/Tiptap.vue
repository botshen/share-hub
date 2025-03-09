<template>
  <div class="">
    <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
      <div class="bubble-menu">
        <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
          Bold
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }">
          Italic
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }">
          Strike
        </button>
        <button @click="editor.chain().focus().toggleHighlight().run()"
          :class="{ 'is-active': editor.isActive('highlight') }">
          Highlight
        </button>
      </div>
    </bubble-menu>
    <editor-content :editor="editor" />
  </div>
</template>

<script lang="ts" setup>
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import { BubbleMenu, Editor, EditorContent } from '@tiptap/vue-3'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  content: {
    type: String,
    default: '',
  }
})

const editor = ref<Editor | null>(null)
const isEditable = ref(true)

watch(isEditable, (value) => {
  if (editor.value) {
    editor.value.setEditable(value)
  }
})

watch(() => props.content, (value) => {
  if (editor.value) {
    editor.value.commands.setContent(value)
  }
})

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      Highlight,
    ],
    content: props.content || '',
  })
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style lang="scss">
/* Basic editor styles */
.tiptap {
  // font-size: 32px;
  width: 100%;
  padding: 4px;
  border: 2px solid transparent;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-radius: 4px;
    border: 2px solid darkred;
  }

  :first-child {
    margin-top: 0;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: #f3f0ff;
    border-radius: 0.4rem;
    color: #1a1a1a;
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: #1a1a1a;
    border-radius: 0.5rem;
    color: #ffffff;
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  blockquote {
    border-left: 3px solid #e5e5e5;
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid #f0f0f0;
    margin: 2rem 0;
  }

  mark {
    background-color: #fef08a;
    border-radius: 0.2rem;
    padding: 0.1em 0.2em;
  }
}

/* Bubble menu */
.bubble-menu {
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 0.7rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  padding: 10px;
  font-size: 16px;
  gap: 10px;

  button {
    background-color: unset;
    padding: 4px;
    border-radius: 4px;

    &:hover {
      background-color: #e5e5e5;
    }

    &.is-active {
      background-color: #6b46c1;
      color: #ffffff;

      &:hover {
        background-color: #553c9a;
      }
    }
  }
}
</style>
