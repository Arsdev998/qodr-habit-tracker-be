/*
  Warnings:

  - You are about to alter the column `about` on the `Evaluation` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `problem` on the `Evaluation` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `title` on the `Habit` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Month` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `lembar` on the `Murajaah` table. All the data in the column will be lost.
  - You are about to alter the column `surah` on the `Murajaah` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(55)`.
  - You are about to alter the column `message` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `surah` on the `Tilawah` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `fullname` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `surah` on the `Ziyadah` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - Added the required column `date` to the `Murajaah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evaluation" ALTER COLUMN "about" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "problem" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Habit" ALTER COLUMN "title" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Month" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Murajaah" DROP COLUMN "lembar",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "surah" SET DATA TYPE VARCHAR(55);

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "message" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Tilawah" ALTER COLUMN "surah" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "fullname" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Ziyadah" ALTER COLUMN "surah" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "lembar" SET DATA TYPE VARCHAR(50);
