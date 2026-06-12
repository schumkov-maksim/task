interface Task {
  id: string;
  title: string;
  description: string;
  user: string;
  userId: string;
  comments: string[];
}

export type { Task };
