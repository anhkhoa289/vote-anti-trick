-- CreateTable
CREATE TABLE "infrastructures" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "infrastructures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "infrastructureId" TEXT NOT NULL,
    "voterName" TEXT,
    "voterEmail" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "votes_infrastructureId_idx" ON "votes"("infrastructureId");

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_infrastructureId_fkey" FOREIGN KEY ("infrastructureId") REFERENCES "infrastructures"("id") ON DELETE CASCADE ON UPDATE CASCADE;
