<script lang="ts" setup>
import type { Comment } from "~/types/Comment";

const props = defineProps<{ comment: Comment; depth?: number }>();
const store = useTaskStore();

const depth = computed(() => props.depth ?? 0);
const replyText = ref("");
const showReplyBox = ref(false);
const loading = ref(false);

const replyEmpty = computed(() => !replyText.value.replace(/<[^>]*>/g, "").trim());

async function submitReply() {
  if (replyEmpty.value) return;
  loading.value = true;
  try {
    await store.replyToComment(props.comment.id, replyText.value);
    replyText.value = "";
    showReplyBox.value = false;
  } finally {
    loading.value = false;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <div :class="depth > 0 ? 'ml-5 border-l-2 border-slate-100 pl-4' : ''">
    <div class="bg-slate-50 rounded-lg px-3 py-2.5">
      <div class="flex items-center gap-2 mb-2">
        <div
          class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0"
        >
          {{ comment.author.name.charAt(0).toUpperCase() }}
        </div>
        <span class="text-xs font-semibold text-slate-700">{{ comment.author.name }}</span>
        <span class="text-xs text-slate-400 ml-auto">{{ formatDate(comment.createdAt) }}</span>
      </div>
      <!-- Render rich-text HTML -->
      <div class="rte-output text-sm text-slate-700 leading-relaxed" v-html="comment.content" />
      <button
        v-if="depth < 3"
        @click="showReplyBox = !showReplyBox"
        class="mt-1.5 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
      >
        {{ showReplyBox ? "Abbrechen" : "Antworten" }}
      </button>
    </div>

    <div v-if="showReplyBox" class="mt-2">
      <ClientOnly>
        <RteEditor v-model="replyText" placeholder="Antwort schreiben…" />
        <template #fallback>
          <textarea
            v-model="replyText"
            rows="2"
            placeholder="Antwort schreiben…"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </template>
      </ClientOnly>
      <div class="flex justify-end mt-2">
        <button
          :disabled="replyEmpty || loading"
          @click="submitReply"
          class="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          Senden
        </button>
      </div>
    </div>

    <div v-if="comment.replies?.length" class="mt-2 space-y-2">
      <CommentThread
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.rte-output :deep(ul) {
  @apply list-disc pl-5 my-1;
}
.rte-output :deep(ol) {
  @apply list-decimal pl-5 my-1;
}
.rte-output :deep(strong) {
  @apply font-bold;
}
.rte-output :deep(em) {
  @apply italic;
}
.rte-output :deep(s) {
  @apply line-through;
}
.rte-output :deep(code) {
  @apply bg-white rounded px-1 text-xs font-mono text-rose-600;
}
.rte-output :deep(p) {
  @apply my-0.5;
}
</style>
