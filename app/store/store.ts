import { defineStore } from "pinia";
import { ref } from "vue";
import type { Task } from "~/types/Task";
import type { User } from "~/types/User";

export const useCounterStore = defineStore("store", () => {
  const showDrawer = ref(false);
  const tasks = ref<Task[]>([]);
  const users = ref<User[]>([]);
  const title = ref<string>("");
  const text = ref<string>("");
  const verantwotlicher = ref<string>("");

  const toggleDrawer = () => {
    showDrawer.value = !showDrawer.value;
  };

  const fetchUsers = async () => {
    users.value = await $fetch<User[]>("/api/users");
  };

  const fetchTasks = async () => {
    const data = await $fetch<any[]>("/api/tasks");
    tasks.value = data.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      user: t.user?.name ?? "",
    }));
  };

  const addTask = async (description: string, userName: string) => {
    if (!title.value.trim() || !description.trim()) return;
    await $fetch("/api/tasks", {
      method: "POST",
      body: { title: title.value, description, userName },
    });
    title.value = "";
    text.value = "";
    verantwotlicher.value = "";
    await fetchTasks();
  };

  return {
    showDrawer,
    tasks,
    users,
    title,
    text,
    verantwotlicher,
    toggleDrawer,
    fetchUsers,
    fetchTasks,
    addTask,
  };
});
