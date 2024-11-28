/*
  Warnings:

  - The values [SUPERADMIN,ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `userSendId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('KESANTRIAN', 'PENGURUS', 'SANTRI');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'SANTRI';
COMMIT;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "userSendId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userSendId_fkey" FOREIGN KEY ("userSendId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
