<script lang="ts" setup>
const store = useTaskStore();
</script>

<template>
  <Drawer />
  <div class="flex flex-col min-h-screen">
    <Header />
    <div class="flex flex-1 overflow-hidden">
      <!-- Mobile backdrop -->
      <Transition name="fade">
        <div
          v-if="store.sidebarOpen"
          class="fixed inset-0 z-30 bg-black/50 md:hidden"
          @click="store.closeSidebar"
        />
      </Transition>

      <Sidebar />

      <main class="flex-1 overflow-y-auto min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from,
.fade-leave-to    { opacity: 0; }
</style>
