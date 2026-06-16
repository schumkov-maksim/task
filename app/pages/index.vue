<script lang="ts" setup>
definePageMeta({ middleware: "auth" });

const store = useTaskStore();

onMounted(async () => {
  await Promise.all([
    store.fetchUsers(),
    store.fetchBoards(),
    store.fetchTasks(),
    store.fetchNotifications(),
  ]);
});
</script>

<template>
  <div>
    <DashboardStats />
    <TaskList />
    <TaskOverview />
  </div>
</template>
