-- DropForeignKey
ALTER TABLE "HabitStatus" DROP CONSTRAINT "HabitStatus_habitId_fkey";

-- AddForeignKey
ALTER TABLE "HabitStatus" ADD CONSTRAINT "HabitStatus_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
