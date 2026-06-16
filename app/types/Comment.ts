export interface Comment {
  id: string;
  content: string;
  author: { id: string; name: string };
  taskId: string;
  parentId: string | null;
  replies: Comment[];
  createdAt: string;
}
