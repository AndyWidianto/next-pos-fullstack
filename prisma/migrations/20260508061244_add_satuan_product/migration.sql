-- CreateEnum
CREATE TYPE "ProductUnit" AS ENUM ('PCS', 'PACK', 'BOX', 'KG', 'GR', 'LITER', 'MTR');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "init" "ProductUnit" NOT NULL DEFAULT 'PCS';
