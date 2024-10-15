-- DropForeignKey
ALTER TABLE "HabitStatus" DROP CONSTRAINT "HabitStatus_dayId_fkey";

-- DropForeignKey
ALTER TABLE "HabitStatus" DROP CONSTRAINT "HabitStatus_monthId_fkey";

-- AddForeignKey
ALTER TABLE "HabitStatus" ADD CONSTRAINT "HabitStatus_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitStatus" ADD CONSTRAINT "HabitStatus_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
