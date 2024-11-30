-- CreateTable
CREATE TABLE "Jurnal" (
    "id" SERIAL NOT NULL,
    "day" VARCHAR(10) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "monthId" INTEGER NOT NULL,
    "activity" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jurnal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationRead" (
    "id" SERIAL NOT NULL,
    "evaluationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluationRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationRead_evaluationId_userId_key" ON "EvaluationRead"("evaluationId", "userId");

-- AddForeignKey
ALTER TABLE "Jurnal" ADD CONSTRAINT "Jurnal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jurnal" ADD CONSTRAINT "Jurnal_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationRead" ADD CONSTRAINT "EvaluationRead_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "EvaluationGeneral"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationRead" ADD CONSTRAINT "EvaluationRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
