-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('todo', 'active', 'done');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'todo';
