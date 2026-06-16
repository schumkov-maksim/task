import prisma from "../utils/prisma";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const { title, description, assigneeId, deadline, boardId } = await readBody(event);

  if (!title?.trim()) {
    throw createError({ statusCode: 400, message: "Titel ist erforderlich." });
  }

  return await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() ?? "",
      createdById: session.user.id,
      assigneeId: assigneeId || null,
      boardId: boardId || null,
      deadline: deadline ? new Date(deadline) : null,
    },
    include: {
      board: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
      comments: true,
    },
  });
});
