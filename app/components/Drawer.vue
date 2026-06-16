<script lang="ts" setup>
import { storeToRefs } from "pinia";

const store = useTaskStore();
const { showDrawer, title, text, assigneeId, deadline, newTaskBoardId, users, boards } = storeToRefs(store);
</script>

<template>
  <Transition name="fade">
    <div
      v-if="showDrawer"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      @click.self="store.toggleDrawer"
    >
      <div class="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl flex flex-col">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 class="text-lg font-semibold text-slate-800">Neue Aufgabe</h2>
          <button
            @click="store.toggleDrawer"
            class="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Titel</label>
            <input
              v-model="title"
              type="text"
              placeholder="Aufgabentitel"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Beschreibung</label>
            <textarea
              v-model="text"
              rows="4"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Was muss erledigt werden?"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Projekt <span class="text-red-400">*</span>
            </label>
            <select
              v-model="newTaskBoardId"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="" disabled>Projekt auswählen…</option>
              <option v-for="board in boards" :key="board.id" :value="board.id">
                {{ board.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
            <input
              v-model="deadline"
              type="date"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Delegieren an</label>
            <select
              v-model="assigneeId"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Niemanden zuweisen</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-slate-200 flex gap-3">
          <button
            @click="store.toggleDrawer"
            class="flex-1 py-2 px-4 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Abbrechen
          </button>
          <button
            :disabled="!title.trim() || !newTaskBoardId"
            @click="store.addTask"
            class="flex-1 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-sm font-medium text-white transition-colors cursor-pointer"
          >
            Erstellen
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
