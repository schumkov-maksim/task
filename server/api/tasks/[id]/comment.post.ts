import prisma from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const taskId = getRouterParam(event, "id")!;
  const { content } = await readBody(event);

  if (!content?.trim()) {
    throw createError({ statusCode: 400, message: "Kommentarinhalt erforderlich." });
  }

  return await prisma.comment.create({
    data: { content: content.trim(), authorId: session.user.id, taskId },
    include: {
      author: { select: { id: true, name: true } },
      replies: { include: { author: { select: { id: true, name: true } } } },
    },
  });
});
