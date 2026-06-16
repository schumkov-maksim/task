<script lang="ts" setup>
import { storeToRefs } from "pinia";

const store = useTaskStore();
const { notifications, unreadCount } = storeToRefs(store);

const open = ref(false);

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Gerade eben";
  if (mins < 60) return `vor ${mins} Min.`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  return `vor ${Math.floor(hours / 24)} Tagen`;
}

async function togglePanel() {
  open.value = !open.value;
  if (open.value) await store.fetchNotifications();
}

async function handleClick(taskId: string | null | undefined) {
  open.value = false;
  if (taskId) store.openTask(taskId);
  await store.markNotificationsRead();
}
</script>

<template>
  <div class="relative">
    <!-- Bell button -->
    <button
      @click="togglePanel"
      class="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
      title="Benachrichtigungen"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.8"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <span
        v-if="unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
      >
        {{ unreadCount > 9 ? "9+" : unreadCount }}
      </span>
    </button>

    <!-- Backdrop -->
    <div v-if="open" class="fixed inset-0 z-40" @click="open = false" />

    <!-- Dropdown panel -->
    <Transition name="drop">
      <div
        v-if="open"
        class="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h3 class="text-sm font-semibold text-slate-800">Benachrichtigungen</h3>
          <button
            v-if="unreadCount > 0"
            @click="store.markNotificationsRead"
            class="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors cursor-pointer"
          >
            Alle gelesen
          </button>
        </div>

        <div class="max-h-80 overflow-y-auto divide-y divide-slate-50">
          <div v-if="!notifications.length" class="px-4 py-8 text-center">
            <svg
              class="w-8 h-8 text-slate-200 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p class="text-sm text-slate-400">Keine Benachrichtigungen</p>
          </div>

          <button
            v-for="n in notifications"
            :key="n.id"
            @click="handleClick(n.taskId)"
            class="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer text-left"
            :class="!n.read ? 'bg-indigo-50/60' : ''"
          >
            <span
              class="mt-1.5 w-2 h-2 rounded-full shrink-0 transition-colors"
              :class="!n.read ? 'bg-indigo-500' : 'bg-slate-200'"
            />
            <div class="min-w-0 flex-1">
              <p
                class="text-xs text-slate-700 leading-snug"
                :class="!n.read ? 'font-semibold' : 'font-medium'"
              >
                {{ n.message }}
              </p>
              <p class="text-[11px] text-slate-400 mt-0.5">{{ timeAgo(n.createdAt) }}</p>
            </div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
  transform-origin: top right;
}
</style>
