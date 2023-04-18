-- CreateTable
CREATE TABLE "Invite" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" TEXT,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invite_userId_key" ON "Invite"("userId");
