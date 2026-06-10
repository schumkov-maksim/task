<script setup lang="ts">
import { useCounterStore } from "~/store/store";

useHead({ title: "Task" });

const store = useCounterStore();
await store.fetchUsers();
await store.fetchTasks();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <div class="container mx-auto p-4">
    <TaskList />
  </div>
</template>
