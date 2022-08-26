-- DropForeignKey
ALTER TABLE "AccountCode" DROP CONSTRAINT "AccountCode_shortcode_id_fkey";

-- AddForeignKey
ALTER TABLE "AccountCode" ADD CONSTRAINT "AccountCode_shortcode_id_fkey" FOREIGN KEY ("shortcode_id") REFERENCES "Shortcode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
