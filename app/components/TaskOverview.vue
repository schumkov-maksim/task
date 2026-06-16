<script lang="ts" setup>
import { storeToRefs } from "pinia";

const store = useTaskStore();
const { showTaskOverview, selectedTask, users } = storeToRefs(store);

const statusOptions = [
  { label: "Offen", value: 0 },
  { label: "In Arbeit", value: 1 },
  { label: "Erledigt", value: 2 },
];

const comment = ref("");
const loading = ref(false);

const commentEmpty = computed(() => !comment.value.replace(/<[^>]*>/g, "").trim());

async function addComment() {
  if (commentEmpty.value || !selectedTask.value) return;
  loading.value = true;
  try {
    await store.addComment(selectedTask.value.id, comment.value);
    comment.value = "";
  } finally {
    loading.value = false;
  }
}

async function changeStatus(e: Event) {
  if (!selectedTask.value) return;
  const val = Number((e.target as HTMLSelectElement).value);
  await store.updateStatus(selectedTask.value.id, val);
}

async function changeAssignee(e: Event) {
  if (!selectedTask.value) return;
  const val = (e.target as HTMLSelectElement).value || null;
  await store.assignTask(selectedTask.value.id, val);
}

function toDateInput(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

async function changeDeadline(e: Event) {
  if (!selectedTask.value) return;
  const val = (e.target as HTMLInputElement).value || null;
  await store.updateDeadline(selectedTask.value.id, val);
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="showTaskOverview"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      @click.self="store.closeTask"
    >
      <div class="absolute right-0 top-0 h-full w-full sm:w-md bg-white shadow-2xl flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 class="text-lg font-semibold text-slate-800 truncate pr-4">
            {{ selectedTask?.title }}
          </h2>
          <button
            @click="store.closeTask"
            class="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none cursor-pointer shrink-0"
          >
            &times;
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <!-- Description -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Beschreibung</p>
            <p class="text-sm text-slate-700 leading-relaxed">
              {{ selectedTask?.description || "Keine Beschreibung." }}
            </p>
          </div>

          <!-- Erstellt von -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Erstellt von</p>
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                {{ selectedTask?.createdBy?.name.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm text-slate-700">{{ selectedTask?.createdBy?.name }}</span>
            </div>
          </div>

          <!-- Projekt -->
          <div v-if="selectedTask?.board">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Projekt</p>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
              {{ selectedTask.board.name }}
            </span>
          </div>

          <!-- Delegiert an (änderbar) -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Delegiert an</p>
            <div class="relative">
              <select
                :value="selectedTask?.assignee?.id ?? ''"
                @change="changeAssignee"
                class="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Niemanden</option>
                <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
              </select>
              <svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Deadline -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Deadline</p>
            <input
              type="date"
              :value="toDateInput(selectedTask?.deadline ?? null)"
              @change="changeDeadline"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- Status -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Status</p>
            <div class="relative">
              <select
                :value="selectedTask?.status"
                @change="changeStatus"
                class="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div class="border-t border-slate-100" />

          <!-- Kommentare -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
              Kommentare ({{ selectedTask?.comments?.length ?? 0 }})
            </p>

            <div v-if="!selectedTask?.comments?.length" class="text-sm text-slate-400 mb-4">
              Noch keine Kommentare.
            </div>
            <div v-else class="space-y-3 mb-4">
              <CommentThread
                v-for="c in selectedTask.comments"
                :key="c.id"
                :comment="c"
              />
            </div>

            <!-- Neuer Kommentar -->
            <ClientOnly>
              <RteEditor v-model="comment" placeholder="Kommentar hinzufügen…" />
              <template #fallback>
                <textarea
                  v-model="comment"
                  rows="3"
                  placeholder="Kommentar hinzufügen…"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </template>
            </ClientOnly>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-200 flex gap-3">
          <button
            @click="store.closeTask"
            class="flex-1 py-2 px-4 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Schließen
          </button>
          <button
            :disabled="commentEmpty || loading"
            @click="addComment"
            class="flex-1 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-white transition-colors cursor-pointer"
          >
            Kommentar senden
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
