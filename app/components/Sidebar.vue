<script lang="ts" setup>
import { storeToRefs } from "pinia";

const store = useTaskStore();
const { boards, activeBoardId, sidebarOpen } = storeToRefs(store);

const newBoardName = ref("");
const showInput = ref(false);
const saving = ref(false);

async function submitBoard() {
  if (!newBoardName.value.trim()) return;
  saving.value = true;
  try {
    const board = await store.createBoard(newBoardName.value.trim());
    activeBoardId.value = board.id;
    newBoardName.value = "";
    showInput.value = false;
  } finally {
    saving.value = false;
  }
}

function selectBoard(id: string | null) {
  activeBoardId.value = id;
  store.closeSidebar();
}

function taskCountFor(boardId: string) {
  return store.tasks.filter((t) => t.board?.id === boardId).length;
}
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 w-56 bg-slate-900 flex flex-col overflow-y-auto
           transition-transform duration-300 ease-in-out
           md:relative md:inset-auto md:z-auto md:translate-x-0 md:shrink-0"
    :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Mobile header row -->
    <div class="flex items-center justify-between px-4 pt-4 pb-1 md:hidden">
      <p class="text-xs font-semibold uppercase tracking-widest text-slate-500">Projekte</p>
      <button
        @click="store.closeSidebar"
        class="text-slate-500 hover:text-slate-300 text-xl leading-none cursor-pointer"
      >
        &times;
      </button>
    </div>

    <div class="px-4 pt-4 pb-3 hidden md:block">
      <p class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Projekte</p>
    </div>

    <nav class="px-4 space-y-0.5 pb-3">
      <button
        @click="selectBoard(null)"
        class="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
        :class="activeBoardId === null ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'"
      >
        <span>Alle Projekte</span>
        <span
          class="text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center"
          :class="activeBoardId === null ? 'bg-indigo-500' : 'bg-slate-700 text-slate-400'"
        >{{ store.tasks.length }}</span>
      </button>

      <button
        v-for="board in boards"
        :key="board.id"
        @click="selectBoard(board.id)"
        class="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
        :class="activeBoardId === board.id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'"
      >
        <span class="truncate">{{ board.name }}</span>
        <span
          class="text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center shrink-0"
          :class="activeBoardId === board.id ? 'bg-indigo-500' : 'bg-slate-700 text-slate-400'"
        >{{ taskCountFor(board.id) }}</span>
      </button>
    </nav>

    <!-- New board input -->
    <div class="px-4 mt-auto pb-4">
      <div v-if="showInput" class="space-y-2">
        <input
          v-model="newBoardName"
          type="text"
          placeholder="Projektname…"
          autofocus
          @keydown.enter="submitBoard"
          @keydown.esc="showInput = false; newBoardName = ''"
          class="w-full px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <div class="flex gap-1.5">
          <button
            :disabled="!newBoardName.trim() || saving"
            @click="submitBoard"
            class="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-medium text-white transition-colors cursor-pointer"
          >Erstellen</button>
          <button
            @click="showInput = false; newBoardName = ''"
            class="px-2 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors cursor-pointer"
          >✕</button>
        </div>
      </div>
      <button
        v-else
        @click="showInput = true"
        class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 text-sm transition-colors cursor-pointer"
      >
        <span class="text-base leading-none">+</span>
        Neues Projekt
      </button>
    </div>
  </aside>
</template>
