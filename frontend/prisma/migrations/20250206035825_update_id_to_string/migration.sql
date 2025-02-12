/*
  Warnings:

  - The primary key for the `api_product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `api_product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "api_product" DROP CONSTRAINT "api_product_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(100);
DROP SEQUENCE "api_product_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "api_product_id_key" ON "api_product"("id");
