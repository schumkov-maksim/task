<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCounterStore } from "../store/store";
import { Status } from "~/enums/enums";

const store = useCounterStore();
const { tasks, users } = storeToRefs(store);
const { changeShowTaskOverview } = store;

const selectedUser = ref("");

const filteredTasks = computed(() => {
  if (!selectedUser.value) return tasks.value;
  return tasks.value.filter((task) => task.user?.id === selectedUser.value);
});

const statusConfig: Record<number, { label: string; classes: string }> = {
  [Status.todo]:     { label: "Todo",        classes: "bg-slate-100 text-slate-500" },
  [Status.progress]: { label: "In Progress", classes: "bg-amber-100 text-amber-600" },
  [Status.done]:     { label: "Done",        classes: "bg-green-100 text-green-600" },
};
</script>

<template>
  <!-- <NewUser /> -->
  <div class="max-w-4xl mx-auto px-6 py-8">
    <!-- Header row -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Tasks</h2>
        <p class="text-sm text-slate-400 mt-0.5">
          {{ filteredTasks.length }} task{{
            filteredTasks.length === 1 ? "" : "s"
          }}
        </p>
      </div>

      <!-- Filter -->
      <div class="relative">
        <select
          v-model="selectedUser"
          class="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="">All assignees</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>

        <svg
          class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="filteredTasks.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <div
        class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4"
      >
        <svg
          class="w-7 h-7 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <p class="text-slate-600 font-medium">No tasks yet</p>
      <p class="text-slate-400 text-sm mt-1">
        Click "Add Task" to get started.
      </p>
    </div>

    <!-- Task list -->
    <ul v-else class="space-y-3">
      <li
        v-for="task in filteredTasks"
        :key="task.id"
        @click="changeShowTaskOverview(task.id)"
        class="group bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
      >
        <!-- Indicator dot -->
        <div
          class="shrink-0 w-2 h-2 rounded-full bg-indigo-400 group-hover:bg-indigo-600 transition-colors"
        />

        <!-- Title + description -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-slate-800 truncate">
            {{ task.title }}
          </p>
          <p class="text-xs text-slate-400 truncate mt-0.5">
            {{ task.description }}
          </p>
        </div>

        <!-- Status badge -->
        <span
          class="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full"
          :class="statusConfig[task.status]?.classes"
        >
          {{ statusConfig[task.status]?.label }}
        </span>

        <!-- Comment count -->
        <div
          v-if="task.comments?.length"
          class="shrink-0 flex items-center gap-1 text-xs text-slate-400"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {{ task.comments.length }}
        </div>

        <!-- Assignee avatar -->
        <div v-if="task.user" class="shrink-0 flex items-center gap-2">
          <div
            class="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold"
          >
            {{ task.user.name.charAt(0).toUpperCase() }}
          </div>
          <span class="text-xs text-slate-500 hidden sm:block">{{
            task.user.name
          }}</span>
        </div>

        <!-- Arrow -->
        <svg
          class="shrink-0 w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </li>
    </ul>
  </div>
</template>
