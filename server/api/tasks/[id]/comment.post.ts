import { defineEventHandler, readBody, getRouterParam } from "h3";
import prisma from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const { comment } = await readBody(event);

  return await prisma.task.update({
    where: { id },
    data: { comments: { push: comment } },
    include: { user: true },
  });
});
