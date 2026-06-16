<script lang="ts" setup>
import type { Comment } from "~/types/Comment";

const props = defineProps<{ comment: Comment; depth?: number }>();
const store = useTaskStore();

const depth = computed(() => props.depth ?? 0);
const replyText = ref("");
const showReplyBox = ref(false);
const loading = ref(false);

async function submitReply() {
  if (!replyText.value.trim()) return;
  loading.value = true;
  try {
    await store.replyToComment(props.comment.id, replyText.value.trim());
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
      <div class="flex items-center gap-2 mb-1">
        <div
          class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0"
        >
          {{ comment.author.name.charAt(0).toUpperCase() }}
        </div>
        <span class="text-xs font-semibold text-slate-700">{{ comment.author.name }}</span>
        <span class="text-xs text-slate-400 ml-auto">{{ formatDate(comment.createdAt) }}</span>
      </div>
      <p class="text-sm text-slate-700 leading-relaxed">{{ comment.content }}</p>
      <button
        v-if="depth < 3"
        @click="showReplyBox = !showReplyBox"
        class="mt-1.5 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
      >
        {{ showReplyBox ? "Abbrechen" : "Antworten" }}
      </button>
    </div>

    <div v-if="showReplyBox" class="mt-2 ml-0">
      <div class="flex gap-2">
        <textarea
          v-model="replyText"
          rows="2"
          placeholder="Antwort schreiben…"
          class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        <button
          :disabled="!replyText.trim() || loading"
          @click="submitReply"
          class="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-medium transition-colors cursor-pointer shrink-0"
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
