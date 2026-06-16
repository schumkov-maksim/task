import prisma from "../utils/prisma";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const { name } = await readBody(event);

  if (!name?.trim()) {
    throw createError({ statusCode: 400, message: "Projektname ist erforderlich." });
  }

  return await prisma.board.create({
    data: { name: name.trim(), ownerId: session.user.id },
    select: { id: true, name: true, ownerId: true, createdAt: true },
  });
});
