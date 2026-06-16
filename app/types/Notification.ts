export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  taskId?: string | null;
  task?: { id: string; title: string } | null;
  createdAt: string;
}
