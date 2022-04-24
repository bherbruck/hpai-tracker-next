/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `HpaiCase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `HpaiCase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HpaiCase" ADD COLUMN     "dateReleased" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HpaiCase_name_key" ON "HpaiCase"("name");
