/*
  Warnings:

  - The `id` column on the `api_product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "api_product_id_key";

-- AlterTable
ALTER TABLE "api_product" DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "api_product_pkey" PRIMARY KEY ("id");
