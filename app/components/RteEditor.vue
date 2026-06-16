<script lang="ts" setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: props.placeholder ?? "Kommentar schreiben…",
    }),
  ],
  editorProps: {
    attributes: { class: "rte-content focus:outline-none" },
  },
  onUpdate({ editor }) {
    emit("update:modelValue", editor.getHTML());
  },
});

watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && editor.value.getHTML() !== val) {
      editor.value.commands.setContent(val ?? "", false);
    }
  },
);

onBeforeUnmount(() => editor.value?.destroy());
</script>

<template>
  <div
    class="border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-shadow"
  >
    <!-- Toolbar -->
    <div class="flex items-center gap-0.5 px-2 py-1 border-b border-slate-200 bg-slate-50">
      <button
        type="button"
        @click="editor?.chain().focus().toggleBold().run()"
        :class="['tb', { 'tb-on': editor?.isActive('bold') }]"
        title="Fett"
      >
        <strong class="text-sm font-black">B</strong>
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="['tb', { 'tb-on': editor?.isActive('italic') }]"
        title="Kursiv"
      >
        <em class="text-sm">I</em>
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleStrike().run()"
        :class="['tb', { 'tb-on': editor?.isActive('strike') }]"
        title="Durchgestrichen"
      >
        <s class="text-sm">S</s>
      </button>
      <span class="w-px h-4 bg-slate-200 mx-0.5" />
      <button
        type="button"
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="['tb', { 'tb-on': editor?.isActive('bulletList') }]"
        title="Liste"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="2" cy="4" r="1.5" />
          <rect x="5" y="3" width="9" height="2" rx="1" />
          <circle cx="2" cy="8" r="1.5" />
          <rect x="5" y="7" width="9" height="2" rx="1" />
          <circle cx="2" cy="12" r="1.5" />
          <rect x="5" y="11" width="9" height="2" rx="1" />
        </svg>
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="['tb', { 'tb-on': editor?.isActive('orderedList') }]"
        title="Nummerierte Liste"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <text x="0.5" y="5.5" font-size="5" font-weight="bold">1.</text>
          <rect x="5" y="3" width="9" height="2" rx="1" />
          <text x="0.5" y="9.5" font-size="5" font-weight="bold">2.</text>
          <rect x="5" y="7" width="9" height="2" rx="1" />
          <text x="0.5" y="13.5" font-size="5" font-weight="bold">3.</text>
          <rect x="5" y="11" width="9" height="2" rx="1" />
        </svg>
      </button>
      <span class="w-px h-4 bg-slate-200 mx-0.5" />
      <button
        type="button"
        @click="editor?.chain().focus().toggleCode().run()"
        :class="['tb', { 'tb-on': editor?.isActive('code') }]"
        title="Code"
      >
        <span class="text-xs font-mono">&lt;/&gt;</span>
      </button>
    </div>
    <!-- Editor area -->
    <EditorContent :editor="editor" />
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.tb {
  @apply w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer;
}
.tb-on {
  @apply bg-slate-200 text-slate-900;
}

:deep(.ProseMirror) {
  @apply px-3 py-2.5 text-sm text-slate-800 focus:outline-none min-h-20;
}
:deep(.ProseMirror p) {
  @apply my-0.5 leading-relaxed;
}
:deep(.ProseMirror ul) {
  @apply list-disc pl-5 my-1;
}
:deep(.ProseMirror ol) {
  @apply list-decimal pl-5 my-1;
}
:deep(.ProseMirror strong) {
  @apply font-bold;
}
:deep(.ProseMirror em) {
  @apply italic;
}
:deep(.ProseMirror s) {
  @apply line-through;
}
:deep(.ProseMirror code) {
  @apply bg-slate-100 rounded px-1 text-xs font-mono text-rose-600;
}
:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  @apply text-slate-400 float-left h-0 pointer-events-none;
}
</style>
