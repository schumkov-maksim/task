import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });
  return { success: true };
});
