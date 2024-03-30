/*
  Warnings:

  - A unique constraint covering the columns `[followerId,followingId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userOneId,userTwoId]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Follow_followerId_followingId_id_key";

-- DropIndex
DROP INDEX "Friendship_userOneId_userTwoId_id_key";

-- CreateIndex
CREATE INDEX "Follow_followerId_followingId_idx" ON "Follow"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "Friendship_userOneId_userTwoId_idx" ON "Friendship"("userOneId", "userTwoId");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_userOneId_userTwoId_key" ON "Friendship"("userOneId", "userTwoId");

-- CreateIndex
CREATE INDEX "UserData_id_idx" ON "UserData"("id");
