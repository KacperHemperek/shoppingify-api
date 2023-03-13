/*
  Warnings:

  - You are about to drop the column `email` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `valid` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "valid";

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_key" ON "Session"("userId");
