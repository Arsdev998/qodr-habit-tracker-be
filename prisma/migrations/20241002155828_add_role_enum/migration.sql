-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'SANTRI');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Month" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Month_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habit" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitStatus" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "habitId" INTEGER NOT NULL,
    "monthId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "comments" TEXT,

    CONSTRAINT "HabitStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Murajaah" (
    "id" SERIAL NOT NULL,
    "surah" TEXT NOT NULL,
    "lembar" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "monthId" INTEGER NOT NULL,

    CONSTRAINT "Murajaah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ziyadah" (
    "id" SERIAL NOT NULL,
    "surah" TEXT NOT NULL,
    "lembar" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "monthId" INTEGER NOT NULL,

    CONSTRAINT "Ziyadah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tilawah" (
    "id" SERIAL NOT NULL,
    "surah" TEXT NOT NULL,
    "lembar" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "monthId" INTEGER NOT NULL,

    CONSTRAINT "Tilawah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warning" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Warning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HabitStatus" ADD CONSTRAINT "HabitStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitStatus" ADD CONSTRAINT "HabitStatus_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitStatus" ADD CONSTRAINT "HabitStatus_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Murajaah" ADD CONSTRAINT "Murajaah_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Murajaah" ADD CONSTRAINT "Murajaah_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ziyadah" ADD CONSTRAINT "Ziyadah_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ziyadah" ADD CONSTRAINT "Ziyadah_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tilawah" ADD CONSTRAINT "Tilawah_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tilawah" ADD CONSTRAINT "Tilawah_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warning" ADD CONSTRAINT "Warning_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
