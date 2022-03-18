-- CreateTable
CREATE TABLE "CountyGeometry" (
    "id" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "geometry" JSONB NOT NULL,

    CONSTRAINT "CountyGeometry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CountyGeometry_county_state_key" ON "CountyGeometry"("county", "state");
