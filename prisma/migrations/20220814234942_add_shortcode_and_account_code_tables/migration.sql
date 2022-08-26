-- CreateTable
CREATE TABLE "Shortcode" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "availableCodes" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Shortcode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountCode" (
    "id" SERIAL NOT NULL,
    "buyerAddress" TEXT NOT NULL,
    "appliedCodes" JSONB NOT NULL DEFAULT '{}',
    "shortcode_id" INTEGER NOT NULL,

    CONSTRAINT "AccountCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shortcode_productId_key" ON "Shortcode"("productId");

-- AddForeignKey
ALTER TABLE "Shortcode" ADD CONSTRAINT "Shortcode_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountCode" ADD CONSTRAINT "AccountCode_shortcode_id_fkey" FOREIGN KEY ("shortcode_id") REFERENCES "Shortcode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
