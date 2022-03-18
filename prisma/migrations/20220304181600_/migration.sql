-- CreateTable
CREATE TABLE "HpaiCase" (
    "id" TEXT NOT NULL,
    "dateConfirmed" TIMESTAMP(3) NOT NULL,
    "state" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "flockType" TEXT NOT NULL,
    "flockSize" INTEGER,
    "pressReleaseUrl" TEXT,

    CONSTRAINT "HpaiCase_pkey" PRIMARY KEY ("id")
);
