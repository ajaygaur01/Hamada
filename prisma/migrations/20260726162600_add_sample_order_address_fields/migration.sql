-- AlterTable
ALTER TABLE "sample_orders" ADD COLUMN "address_line1" TEXT,
ADD COLUMN "address_line2" TEXT,
ADD COLUMN "landmark" TEXT,
ADD COLUMN "delivery_state" VARCHAR,
ADD COLUMN "country" VARCHAR DEFAULT 'India';
