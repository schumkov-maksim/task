<script lang="ts" setup>
import { useCounterStore } from "../store/store";

const { toggleDrawer } = useCounterStore();
</script>

<template>
  <header class="bg-slate-900 text-white shadow-lg">
    <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <span class="text-xl font-semibold tracking-tight">Task Manager</span>
      <button
        @click="toggleDrawer"
        class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
      >
        <span class="text-lg leading-none">+</span>
        Add Task
      </button>
      <button
        class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
      >
        <span class="text-lg leading-none">+</span>
        Add User
      </button>
    </div>
  </header>
</template>
