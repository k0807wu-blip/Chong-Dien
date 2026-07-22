-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('SUPPLY', 'LIVE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'SUPPLY';

