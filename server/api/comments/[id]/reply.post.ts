import prisma from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const parentId = getRouterParam(event, "id")!;
  const { content } = await readBody(event);

  if (!content?.trim()) {
    throw createError({ statusCode: 400, message: "Antwortinhalt erforderlich." });
  }

  const parent = await prisma.comment.findUnique({ where: { id: parentId } });
  if (!parent) {
    throw createError({ statusCode: 404, message: "Kommentar nicht gefunden." });
  }

  return await prisma.comment.create({
    data: {
      content: content.trim(),
      authorId: session.user.id,
      taskId: parent.taskId,
      parentId,
    },
    include: {
      author: { select: { id: true, name: true } },
      replies: { include: { author: { select: { id: true, name: true } } } },
    },
  });
});
