import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.upsert({
    where: { id: "seed-user-1" },
    update: {},
    create: { id: "seed-user-1", name: "John Doe" },
  });
  await prisma.user.upsert({
    where: { id: "seed-user-2" },
    update: {},
    create: { id: "seed-user-2", name: "Jane Smith" },
  });
  console.log("Seed done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
