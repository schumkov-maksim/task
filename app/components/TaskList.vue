<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCounterStore } from "../store/store";

const { tasks, users } = storeToRefs(useCounterStore());

const selectedUser = ref("");

const filteredTasks = computed(() => {
  if (!selectedUser.value) {
    return tasks.value;
  }
  return tasks.value.filter((task) => task.userId === selectedUser.value);
});
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-8">
    <h2 class="text-2xl font-semibold text-slate-800 mb-6">Tasks</h2>

    <select
      v-model="selectedUser"
      class="mb-4 p-2 border border-slate-300 rounded"
    >
      <option value="">All Users</option>
      <option v-for="user in users" :key="user.id" :value="user.id">
        {{ user.name }}
      </option>
    </select>

    <p v-if="filteredTasks.length === 0" class="text-slate-400 text-sm">
      No tasks yet. Click "Add Task" to get started.
    </p>

    <ul v-else class="space-y-3">
      <li
        v-for="task in filteredTasks"
        :key="task.id"
        class="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-start justify-between shadow-sm"
      >
        <div class="">
          <p class="text-slate-800 text-sm">{{ task.title }}</p>
        </div>
        <p class="text-slate-800 text-sm">{{ task.description }}</p>
        <span
          v-if="task.user"
          class="ml-4 shrink-0 bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full"
        >
          {{ task.user }}
        </span>
      </li>
    </ul>
  </div>
</template>
