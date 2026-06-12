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
  const showTaskOverview = ref<boolean>(false);
  const verantwotlicher = ref<string>("");
  const TaskId = ref<string>("");

  const toggleDrawer = () => {
    showDrawer.value = !showDrawer.value;
  };

  const changeShowTaskOverview = (id: string) => {
    TaskId.value = id;
    showTaskOverview.value = !showTaskOverview.value;
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
      user: t.user ?? null,
      comments: t.comments ?? [],
      status: t.status ?? null,
    }));
  };

  const updateTaskStatus = async (taskId: string, status: number) => {
    await $fetch(`/api/tasks/${taskId}/status`, {
      method: "PATCH",
      body: { status },
    });
    await fetchTasks();
  };

  const addComment = async (taskId: string, comment: string) => {
    await $fetch(`/api/tasks/${taskId}/comment`, {
      method: "POST",
      body: { comment },
    });
    await fetchTasks();
  };

  const addTask = async (description: string, userName: string) => {
    if (!title.value.trim() || !description.trim()) return;
    await $fetch("/api/tasks", {
      method: "POST",
      body: { title: title.value, description, userName, status: 0 },
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
    showTaskOverview,
    changeShowTaskOverview,
    TaskId,
    addComment,
    updateTaskStatus,
  };
});
