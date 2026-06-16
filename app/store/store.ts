import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Task } from "~/types/Task";
import type { User } from "~/types/User";
import type { Board } from "~/types/Board";

export const useTaskStore = defineStore("store", () => {
  const showDrawer = ref(false);
  const tasks = ref<Task[]>([]);
  const users = ref<User[]>([]);
  const boards = ref<Board[]>([]);
  const showTaskOverview = ref(false);
  const activeTaskId = ref("");
  const activeBoardId = ref<string | null>(null);
  const sidebarOpen = ref(false);

  const title = ref("");
  const text = ref("");
  const assigneeId = ref("");
  const deadline = ref("");
  const newTaskBoardId = ref("");

  const selectedTask = computed(() =>
    tasks.value.find((t) => t.id === activeTaskId.value),
  );

  const visibleTasks = computed(() =>
    activeBoardId.value
      ? tasks.value.filter((t) => t.board?.id === activeBoardId.value)
      : tasks.value,
  );

  const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value; };
  const closeSidebar = () => { sidebarOpen.value = false; };

  const toggleDrawer = () => {
    newTaskBoardId.value = activeBoardId.value ?? "";
    showDrawer.value = !showDrawer.value;
  };

  const openTask = (id: string) => {
    activeTaskId.value = id;
    showTaskOverview.value = true;
  };

  const closeTask = () => {
    showTaskOverview.value = false;
    activeTaskId.value = "";
  };

  const fetchUsers = async () => {
    users.value = await $fetch<User[]>("/api/users");
  };

  const fetchBoards = async () => {
    boards.value = await $fetch<Board[]>("/api/boards");
  };

  const createBoard = async (name: string) => {
    const board = await $fetch<Board>("/api/boards", {
      method: "POST",
      body: { name },
    });
    boards.value.push(board);
    return board;
  };

  const fetchTasks = async () => {
    const data = await $fetch<any[]>("/api/tasks");
    tasks.value = data.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status ?? 0,
      createdBy: t.createdBy,
      assignee: t.assignee ?? null,
      board: t.board ?? null,
      comments: t.comments ?? [],
      deadline: t.deadline ?? null,
      createdAt: t.createdAt,
    }));
  };

  const addTask = async () => {
    if (!title.value.trim()) return;
    await $fetch("/api/tasks", {
      method: "POST",
      body: {
        title: title.value.trim(),
        description: text.value.trim(),
        assigneeId: assigneeId.value || null,
        boardId: newTaskBoardId.value || null,
        deadline: deadline.value || null,
      },
    });
    title.value = "";
    text.value = "";
    assigneeId.value = "";
    deadline.value = "";
    newTaskBoardId.value = "";
    showDrawer.value = false;
    await fetchTasks();
  };

  const updateStatus = async (taskId: string, status: number) => {
    await $fetch(`/api/tasks/${taskId}/status`, { method: "PATCH", body: { status } });
    await fetchTasks();
  };

  const assignTask = async (taskId: string, newAssigneeId: string | null) => {
    await $fetch(`/api/tasks/${taskId}/assign`, { method: "PATCH", body: { assigneeId: newAssigneeId } });
    await fetchTasks();
  };

  const addComment = async (taskId: string, content: string) => {
    await $fetch(`/api/tasks/${taskId}/comment`, { method: "POST", body: { content } });
    await fetchTasks();
  };

  const updateDeadline = async (taskId: string, newDeadline: string | null) => {
    await $fetch(`/api/tasks/${taskId}/deadline`, { method: "PATCH", body: { deadline: newDeadline } });
    await fetchTasks();
  };

  const replyToComment = async (commentId: string, content: string) => {
    await $fetch(`/api/comments/${commentId}/reply`, { method: "POST", body: { content } });
    await fetchTasks();
  };

  return {
    showDrawer,
    tasks,
    users,
    boards,
    activeBoardId,
    sidebarOpen,
    visibleTasks,
    title,
    text,
    assigneeId,
    deadline,
    newTaskBoardId,
    showTaskOverview,
    activeTaskId,
    selectedTask,
    toggleSidebar,
    closeSidebar,
    toggleDrawer,
    openTask,
    closeTask,
    fetchUsers,
    fetchBoards,
    createBoard,
    fetchTasks,
    addTask,
    updateStatus,
    assignTask,
    addComment,
    updateDeadline,
    replyToComment,
  };
});

export const useCounterStore = useTaskStore;
