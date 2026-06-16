import prisma from "../utils/prisma";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  return await prisma.notification.findMany({
    where: { userId: session.user.id },
    include: { task: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
});
