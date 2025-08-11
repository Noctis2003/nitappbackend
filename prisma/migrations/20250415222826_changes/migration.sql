-- CreateTable
CREATE TABLE "CollabGig" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CollabGig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollabRole" (
    "id" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "filled" INTEGER NOT NULL DEFAULT 0,
    "gigId" INTEGER NOT NULL,

    CONSTRAINT "CollabRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollabApplication" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CollabApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollabApplication_roleId_userId_key" ON "CollabApplication"("roleId", "userId");

-- AddForeignKey
ALTER TABLE "CollabGig" ADD CONSTRAINT "CollabGig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabRole" ADD CONSTRAINT "CollabRole_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "CollabGig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabApplication" ADD CONSTRAINT "CollabApplication_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "CollabRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabApplication" ADD CONSTRAINT "CollabApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
