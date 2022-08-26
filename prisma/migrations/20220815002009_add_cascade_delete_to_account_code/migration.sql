-- DropForeignKey
ALTER TABLE "AccountCode" DROP CONSTRAINT "AccountCode_shortcode_id_fkey";

-- DropForeignKey
ALTER TABLE "Shortcode" DROP CONSTRAINT "Shortcode_productId_fkey";

-- AddForeignKey
ALTER TABLE "Shortcode" ADD CONSTRAINT "Shortcode_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountCode" ADD CONSTRAINT "AccountCode_shortcode_id_fkey" FOREIGN KEY ("shortcode_id") REFERENCES "Shortcode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
