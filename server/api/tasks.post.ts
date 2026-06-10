import { defineEventHandler, readBody } from "h3";
import prisma from "../utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const user = body.userName
    ? await prisma.user.findFirst({ where: { name: body.userName } })
    : null;

  return await prisma.task.create({
    data: {
      title: body.title,
      description: body.description,
      userId: user?.id ?? null,
    },
    include: { user: true },
  });
});
