-- CreateTable
CREATE TABLE "Currency" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "quote" DOUBLE PRECISION NOT NULL,
    "cmcId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Currency_address_key" ON "Currency"("address");

-- CreateIndex
CREATE INDEX "Currency_address_idx" ON "Currency" USING HASH ("address");
