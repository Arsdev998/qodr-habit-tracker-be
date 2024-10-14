-- DropForeignKey
ALTER TABLE "Day" DROP CONSTRAINT "Day_monthId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "fullname" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Day" ADD CONSTRAINT "Day_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;
