import prisma from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")!;
  const { deadline } = await readBody(event);

  return await prisma.task.update({
    where: { id },
    data: { deadline: deadline ? new Date(deadline) : null },
  });
});
