import type { Comment } from "./Comment";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: number;
  createdBy: { id: string; name: string };
  assignee: { id: string; name: string } | null;
  board: { id: string; name: string } | null;
  comments: Comment[];
  deadline: string | null;
  createdAt: string;
}
