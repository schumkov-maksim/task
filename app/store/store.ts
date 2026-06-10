import { defineStore } from "pinia";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import type { Task } from "~/types/Task";
import type { User } from "~/types/User";

export const useCounterStore = defineStore("store", () => {
  const showDrawer = ref(false);

  const toggleDrawer = () => {
    showDrawer.value = !showDrawer.value;
  };

  const tasks = ref<Task[]>([]);
  const text = ref<string>("");
  const title = ref<string>(" ");
  const user = ref<User>();
  const verantwotlicher = ref<string>("");
  const addTask = (description: string, user: string) => {
    const newTask = {
      id: uuidv4(),
      title: title.value,
      description,
      user: verantwotlicher.value,
    };
    if (description.trim() !== "") {
      tasks.value.push(newTask);
      title.value = "";
      text.value = "";
      verantwotlicher.value = user;
    }
  };

  const users = ref<User[]>([
    {
      id: uuidv4(),
      name: "John Doe",
    },
    {
      id: uuidv4(),
      name: "Jane Smith",
    },
  ]);

  return {
    showDrawer,
    tasks,
    toggleDrawer,
    addTask,
    text,
    users,
    user,
    title,
    verantwotlicher,
  };
});
