/*
  Warnings:

  - A unique constraint covering the columns `[followerId,followingId,id]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userOneId,userTwoId,id]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Follow_followerId_followingId_key";

-- DropIndex
DROP INDEX "Friendship_userOneId_userTwoId_key";

-- DropIndex
DROP INDEX "User_username_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_id_key" ON "Follow"("followerId", "followingId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_userOneId_userTwoId_id_key" ON "Friendship"("userOneId", "userTwoId", "id");

-- CreateIndex
CREATE INDEX "User_username_id_idx" ON "User"("username", "id");
