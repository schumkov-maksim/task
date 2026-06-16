import prisma from "../utils/prisma";

const commentInclude = {
  author: { select: { id: true, name: true } },
  replies: {
    include: {
      author: { select: { id: true, name: true } },
      replies: {
        include: {
          author: { select: { id: true, name: true } },
          replies: true,
        },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
};

export default defineEventHandler(async () => {
  return await prisma.task.findMany({
    include: {
      board: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
      comments: {
        where: { parentId: null },
        include: commentInclude,
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
});
