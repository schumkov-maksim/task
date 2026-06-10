<script setup lang="ts">
useHead({
  title: "Task",
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <div class="container mx-auto p-4">
    <TaskList />
  </div>
</template>
