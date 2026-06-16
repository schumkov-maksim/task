import prisma from "../utils/prisma";

export default defineEventHandler(async () => {
  return await prisma.board.findMany({
    select: { id: true, name: true, ownerId: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
});
