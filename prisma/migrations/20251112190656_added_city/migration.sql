/*
  Warnings:

  - You are about to drop the column `location` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "city" TEXT;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "location";
