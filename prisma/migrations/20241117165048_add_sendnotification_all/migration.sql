-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "rawMessage" TEXT,
ALTER COLUMN "message" SET DATA TYPE TEXT;
