<script lang="ts" setup>
import { storeToRefs } from "pinia";

const store = useTaskStore();
const { users, visibleTasks, activeBoardId } = storeToRefs(store);

const selectedUser = ref("");
const activeTab = ref(0);

const filteredTasks = computed(() => {
  if (!selectedUser.value) return visibleTasks.value;
  return visibleTasks.value.filter((t) => t.assignee?.id === selectedUser.value);
});

const columns = [
  {
    status: 0,
    label: "Offen",
    dot: "bg-slate-400",
    text: "text-slate-600",
    badge: "bg-slate-100 text-slate-600",
    empty: "border-slate-200",
  },
  {
    status: 1,
    label: "In Arbeit",
    dot: "bg-amber-400",
    text: "text-amber-700",
    badge: "bg-amber-50 text-amber-700",
    empty: "border-amber-200",
  },
  {
    status: 2,
    label: "Erledigt",
    dot: "bg-green-400",
    text: "text-green-700",
    badge: "bg-green-50 text-green-700",
    empty: "border-green-200",
  },
];

function tasksFor(status: number) {
  return filteredTasks.value.filter((t) => t.status === status);
}

function deadlineInfo(iso: string | null) {
  if (!iso) return null;
  const diff = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (diff < 0) return { label: "Überfällig", classes: "bg-red-100 text-red-600" };
  if (diff <= 2) return { label: `${diff}T`, classes: "bg-orange-100 text-orange-600" };
  return {
    label: new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }),
    classes: "bg-slate-100 text-slate-500",
  };
}

const heading = computed(() => {
  if (!activeBoardId.value) return "Alle Aufgaben";
  return store.boards.find((b) => b.id === activeBoardId.value)?.name ?? "Aufgaben";
});
</script>

<template>
  <div class="px-4 sm:px-6 py-5 sm:py-6">

    <!-- Header row -->
    <div class="flex items-center justify-between mb-5 gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-800">{{ heading }}</h2>
        <p class="text-sm text-slate-400 mt-0.5">
          {{ filteredTasks.length }} Aufgabe{{ filteredTasks.length === 1 ? "" : "n" }}
        </p>
      </div>

      <div class="relative shrink-0">
        <select
          v-model="selectedUser"
          class="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="">Alle</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
        <svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Mobile tab bar -->
    <div class="flex gap-1.5 mb-4 md:hidden">
      <button
        v-for="col in columns"
        :key="col.status"
        @click="activeTab = col.status"
        class="flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        :class="activeTab === col.status
          ? 'bg-slate-800 text-white shadow-sm'
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
      >
        {{ col.label }}
        <span
          class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px]"
          :class="activeTab === col.status ? 'bg-white/20' : 'bg-slate-200 text-slate-500'"
        >
          {{ tasksFor(col.status).length }}
        </span>
      </button>
    </div>

    <!-- Kanban board -->
    <div class="flex gap-4 items-start">

      <!-- Desktop: all 3 columns at once -->
      <!-- Mobile: only the active tab column -->
      <div
        v-for="col in columns"
        :key="col.status"
        class="flex-1 min-w-0"
        :class="activeTab === col.status ? 'block md:block' : 'hidden md:block'"
      >
        <!-- Column header (desktop only) -->
        <div class="hidden md:flex items-center gap-2 mb-3 px-1">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="col.dot" />
          <span class="text-sm font-semibold" :class="col.text">{{ col.label }}</span>
          <span class="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full" :class="col.badge">
            {{ tasksFor(col.status).length }}
          </span>
        </div>

        <!-- Empty state -->
        <div
          v-if="!tasksFor(col.status).length"
          class="rounded-xl border-2 border-dashed p-8 text-center"
          :class="col.empty"
        >
          <p class="text-sm text-slate-400 font-medium">Keine Aufgaben</p>
        </div>

        <!-- Task cards -->
        <div class="space-y-2.5">
          <div
            v-for="task in tasksFor(col.status)"
            :key="task.id"
            @click="store.openTask(task.id)"
            class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all group active:scale-[0.99]"
          >
            <!-- Board tag -->
            <span
              v-if="!activeBoardId && task.board"
              class="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500 mb-2"
            >
              {{ task.board.name }}
            </span>

            <!-- Title -->
            <p class="text-sm font-semibold text-slate-800 leading-snug group-hover:text-indigo-700 transition-colors">
              {{ task.title }}
            </p>

            <!-- Description -->
            <p
              v-if="task.description"
              class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed"
            >
              {{ task.description }}
            </p>

            <!-- Footer -->
            <div class="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <!-- Assignee -->
              <div v-if="task.assignee" class="flex items-center gap-1.5 min-w-0">
                <div
                  class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0"
                >
                  {{ task.assignee.name.charAt(0).toUpperCase() }}
                </div>
                <span class="text-xs text-slate-500 truncate hidden sm:block">{{ task.assignee.name }}</span>
              </div>

              <div class="flex-1" />

              <!-- Deadline -->
              <span
                v-if="deadlineInfo(task.deadline)"
                class="text-[11px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
                :class="deadlineInfo(task.deadline)!.classes"
              >
                {{ deadlineInfo(task.deadline)!.label }}
              </span>

              <!-- Comment count -->
              <div
                v-if="task.comments?.length"
                class="flex items-center gap-1 text-xs text-slate-400 shrink-0"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {{ task.comments.length }}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
