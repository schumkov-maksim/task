import prisma from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const taskId = getRouterParam(event, "id")!;
  const { content } = await readBody(event);

  const stripped = (content ?? "").replace(/<[^>]*>/g, "").trim();
  if (!stripped) {
    throw createError({ statusCode: 400, message: "Kommentarinhalt erforderlich." });
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { assigneeId: true, title: true },
  });
  if (!task) throw createError({ statusCode: 404, message: "Aufgabe nicht gefunden." });

  const comment = await prisma.comment.create({
    data: { content, authorId: session.user.id, taskId },
    include: {
      author: { select: { id: true, name: true } },
      replies: { include: { author: { select: { id: true, name: true } } } },
    },
  });

  if (task.assigneeId && task.assigneeId !== session.user.id) {
    await prisma.notification.create({
      data: {
        userId: task.assigneeId,
        message: `Neuer Kommentar in "${task.title}"`,
        taskId,
      },
    });
  }

  return comment;
});
