<script lang="ts" setup>
const store = useTaskStore();
const { user, clear } = useUserSession();

async function logout() {
  await $fetch("/api/auth/logout", { method: "POST" });
  await clear();
  await navigateTo("/login");
}
</script>

<template>
  <header class="bg-slate-900 text-white shadow-lg shrink-0 z-20 relative">
    <div class="px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-3">
      <!-- Hamburger (mobile only) -->
      <button
        @click="store.toggleSidebar"
        class="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8 shrink-0 cursor-pointer"
        aria-label="Menü"
      >
        <span class="block h-0.5 w-5 bg-slate-300 rounded-full" />
        <span class="block h-0.5 w-5 bg-slate-300 rounded-full" />
        <span class="block h-0.5 w-4 bg-slate-300 rounded-full" />
      </button>

      <span class="text-lg sm:text-xl font-semibold tracking-tight">Task Manager</span>

      <div class="flex-1" />

      <!-- New task button -->
      <button
        @click="store.toggleDrawer"
        class="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm"
      >
        <span class="text-lg leading-none">+</span>
        <span class="hidden sm:inline">Neue Aufgabe</span>
      </button>

      <!-- User -->
      <div v-if="user" class="flex items-center gap-2">
        <div
          class="w-8 h-8 rounded-full bg-indigo-400 text-white flex items-center justify-center text-sm font-bold shrink-0"
        >
          {{ user.name.charAt(0).toUpperCase() }}
        </div>
        <span class="text-sm text-slate-300 hidden md:block">{{ user.name }}</span>
        <button
          @click="logout"
          class="hidden sm:block text-slate-400 hover:text-white text-xs px-2 py-1 rounded transition-colors cursor-pointer"
        >
          Abmelden
        </button>
      </div>
    </div>
  </header>
</template>
