import prisma from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")!;
  const { assigneeId } = await readBody(event);

  return await prisma.task.update({
    where: { id },
    data: { assigneeId: assigneeId || null },
    include: {
      assignee: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
    },
  });
});
