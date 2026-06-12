import { Status } from "~/enums/enums";

interface Task {
  id: string;
  title: string;
  description: string;
  user: { id: string; name: string } | null;
  comments: string[];
  status: Status;
}

export type { Task };
