/*
  Warnings:

  - You are about to alter the column `about` on the `Evaluation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `motivation` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "Evaluation" ALTER COLUMN "about" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "major" VARCHAR(50) NOT NULL DEFAULT '',
ADD COLUMN     "numberPhone" TEXT NOT NULL DEFAULT '+62',
ADD COLUMN     "techStack" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "motivation" SET DATA TYPE VARCHAR(50);

-- CreateTable
CREATE TABLE "EvaluationGeneral" (
    "id" SERIAL NOT NULL,
    "about" VARCHAR(50) NOT NULL,
    "problem" VARCHAR(500) NOT NULL,
    "userId" INTEGER NOT NULL,
    "identifier" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluationGeneral_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EvaluationGeneral" ADD CONSTRAINT "EvaluationGeneral_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
