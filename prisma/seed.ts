import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma";
import "dotenv/config";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hash = (pw: string) => bcrypt.hash(pw, 12);

  const john = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      id: "seed-user-1",
      name: "John Doe",
      email: "john@example.com",
      passwordHash: await hash("password123"),
    },
  });

  const jane = await prisma.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      id: "seed-user-2",
      name: "Jane Smith",
      email: "jane@example.com",
      passwordHash: await hash("password123"),
    },
  });

  const board = await prisma.board.upsert({
    where: { id: "seed-board-1" },
    update: {},
    create: {
      id: "seed-board-1",
      name: "Demo-Projekt",
      ownerId: john.id,
    },
  });

  const task = await prisma.task.upsert({
    where: { id: "seed-task-1" },
    update: { boardId: board.id },
    create: {
      id: "seed-task-1",
      title: "Welcome Task",
      description: "This is an example task to get you started.",
      status: 0,
      createdById: john.id,
      assigneeId: jane.id,
      boardId: board.id,
    },
  });

  await prisma.comment.upsert({
    where: { id: "seed-comment-1" },
    update: {},
    create: {
      id: "seed-comment-1",
      content: "Looking good! I'll take care of this.",
      authorId: jane.id,
      taskId: task.id,
    },
  });

  console.log("Seed done. Login: john@example.com / password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
