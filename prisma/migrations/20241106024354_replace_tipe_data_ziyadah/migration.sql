/*
  Warnings:

  - You are about to drop the column `lembar` on the `Ziyadah` table. All the data in the column will be lost.
  - Added the required column `date` to the `Ziyadah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ziyadah" DROP COLUMN "lembar",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
