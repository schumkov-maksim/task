<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCounterStore } from "../store/store";

const store = useCounterStore();
const { showDrawer, text, verantwotlicher, users } = storeToRefs(store);
const { toggleDrawer, addTask } = store;
</script>

<template>
  <Transition name="fade">
    <div
      v-if="showDrawer"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      @click.self="toggleDrawer"
    >
      <div
        class="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl flex flex-col"
      >
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-slate-200"
        >
          <h2 class="text-lg font-semibold text-slate-800">New Task</h2>
          <button
            @click="toggleDrawer"
            class="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <input
              type="text"
              v-model="store.title"
              placeholder="Task title"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Description</label
            >
            <textarea
              v-model="text"
              rows="4"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="What needs to be done?"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Assignee</label
            >
            <select
              v-model="verantwotlicher"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="" disabled>Select a user…</option>
              <option v-for="user in users" :key="user.id" :value="user.name">
                {{ user.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-slate-200 flex gap-3">
          <button
            @click="toggleDrawer"
            class="flex-1 py-2 px-4 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="addTask(text, verantwotlicher)"
            class="flex-1 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors cursor-pointer"
          >
            Add Task
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
