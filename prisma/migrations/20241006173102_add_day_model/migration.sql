/*
  Warnings:

  - Added the required column `dayId` to the `HabitStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HabitStatus" ADD COLUMN     "dayId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Day" (
    "id" SERIAL NOT NULL,
    "date" INTEGER NOT NULL,
    "monthId" INTEGER NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Day" ADD CONSTRAINT "Day_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitStatus" ADD CONSTRAINT "HabitStatus_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
