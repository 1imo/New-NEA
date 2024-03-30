/*
  Warnings:

  - You are about to drop the column `timeTwo` on the `ViewedPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ViewedPost" DROP COLUMN "timeTwo";

-- CreateIndex
CREATE INDEX "Chatroom_id_idx" ON "Chatroom"("id");
