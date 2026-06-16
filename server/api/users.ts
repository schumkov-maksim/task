import prisma from "../utils/prisma";

export default defineEventHandler(async () => {
  return await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
});
