/*
  Warnings:

  - Added the required column `joinDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motivation` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "joinDate" TEXT NOT NULL,
ADD COLUMN     "motivation" TEXT NOT NULL;
