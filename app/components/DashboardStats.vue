<script lang="ts" setup>
import { storeToRefs } from "pinia";

const store = useTaskStore();
const { visibleTasks } = storeToRefs(store);

const stats = computed(() => [
  {
    label: "Gesamt",
    value: visibleTasks.value.length,
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    bg: "bg-slate-100",
    fg: "text-slate-600",
    bar: "bg-slate-400",
  },
  {
    label: "Offen",
    value: visibleTasks.value.filter((t) => t.status === 0).length,
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    bg: "bg-amber-50",
    fg: "text-amber-700",
    bar: "bg-amber-400",
  },
  {
    label: "In Arbeit",
    value: visibleTasks.value.filter((t) => t.status === 1).length,
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    bg: "bg-blue-50",
    fg: "text-blue-700",
    bar: "bg-blue-400",
  },
  {
    label: "Erledigt",
    value: visibleTasks.value.filter((t) => t.status === 2).length,
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    bg: "bg-green-50",
    fg: "text-green-700",
    bar: "bg-green-400",
  },
]);

const total = computed(() => visibleTasks.value.length || 1);
</script>

<template>
  <div class="px-4 sm:px-6 pt-5 sm:pt-7 pb-1">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div
        v-for="s in stats"
        :key="s.label"
        class="rounded-xl p-4 flex flex-col gap-2"
        :class="s.bg"
      >
        <div class="flex items-start justify-between gap-2">
          <span class="text-2xl font-bold leading-none" :class="s.fg">{{ s.value }}</span>
          <svg class="w-5 h-5 opacity-50 shrink-0" :class="s.fg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="s.icon" />
          </svg>
        </div>
        <p class="text-xs font-semibold uppercase tracking-wide opacity-60" :class="s.fg">{{ s.label }}</p>
        <!-- progress bar -->
        <div class="h-1 rounded-full bg-black/10 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="s.bar"
            :style="{ width: `${Math.round((s.value / total) * 100)}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
