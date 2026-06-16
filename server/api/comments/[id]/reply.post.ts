import prisma from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const parentId = getRouterParam(event, "id")!;
  const { content } = await readBody(event);

  const stripped = (content ?? "").replace(/<[^>]*>/g, "").trim();
  if (!stripped) {
    throw createError({ statusCode: 400, message: "Antwortinhalt erforderlich." });
  }

  const parent = await prisma.comment.findUnique({
    where: { id: parentId },
    include: { task: { select: { title: true } } },
  });
  if (!parent) throw createError({ statusCode: 404, message: "Kommentar nicht gefunden." });

  const reply = await prisma.comment.create({
    data: {
      content,
      authorId: session.user.id,
      taskId: parent.taskId,
      parentId,
    },
    include: {
      author: { select: { id: true, name: true } },
      replies: { include: { author: { select: { id: true, name: true } } } },
    },
  });

  if (parent.authorId !== session.user.id) {
    await prisma.notification.create({
      data: {
        userId: parent.authorId,
        message: `Neue Antwort auf deinen Kommentar in "${parent.task.title}"`,
        taskId: parent.taskId,
      },
    });
  }

  return reply;
});
