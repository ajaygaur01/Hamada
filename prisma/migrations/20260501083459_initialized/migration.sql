-- CreateEnum
CREATE TYPE "Role" AS ENUM ('customer', 'admin');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('upi', 'razorpay', 'bank_transfer');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'verified', 'paid', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "GstinVerificationStatus" AS ENUM ('pending', 'verified', 'failed');

-- CreateEnum
CREATE TYPE "EmailType" AS ENUM ('sample_confirmation', 'bulk_confirmation', 'dispatched', 'gstin_verified', 'welcome');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('sent', 'failed');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR NOT NULL,
    "password_hash" VARCHAR,
    "full_name" VARCHAR,
    "phone" VARCHAR,
    "role" "Role" NOT NULL DEFAULT 'customer',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "gstin" VARCHAR,
    "gstin_verified" BOOLEAN NOT NULL DEFAULT false,
    "company_name" VARCHAR,
    "company_address" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "full_name" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "address_line1" TEXT NOT NULL,
    "address_line2" TEXT,
    "city" VARCHAR NOT NULL,
    "state" VARCHAR NOT NULL,
    "pincode" VARCHAR NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "description" TEXT,
    "display_order" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "grade" VARCHAR,
    "short_description" VARCHAR NOT NULL,
    "full_description" TEXT NOT NULL,
    "origin" VARCHAR,
    "tasting_profile" TEXT,
    "use_cases" TEXT[],
    "storage_instructions" TEXT,
    "shelf_life" VARCHAR,
    "brewing_guide" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "size" VARCHAR NOT NULL,
    "unit" VARCHAR NOT NULL,
    "sample_price" DECIMAL NOT NULL,
    "bulk_price" DECIMAL NOT NULL,
    "stock_quantity" INTEGER NOT NULL,
    "min_bulk_quantity" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "image_url" VARCHAR NOT NULL,
    "alt_text" VARCHAR,
    "display_order" INTEGER,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sample_orders" (
    "id" UUID NOT NULL,
    "order_number" VARCHAR NOT NULL,
    "customer_name" VARCHAR NOT NULL,
    "business_name" VARCHAR,
    "email" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "delivery_city" VARCHAR NOT NULL,
    "pincode" VARCHAR NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "sample_size" VARCHAR NOT NULL,
    "amount" DECIMAL NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "upi_transaction_id" VARCHAR,
    "razorpay_order_id" VARCHAR,
    "razorpay_payment_id" VARCHAR,
    "payment_status" "PaymentStatus" NOT NULL,
    "order_status" "OrderStatus" NOT NULL,
    "tracking_link" VARCHAR,
    "dispatched_at" TIMESTAMP(6),
    "notes" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "sample_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bulk_orders" (
    "id" UUID NOT NULL,
    "order_number" VARCHAR NOT NULL,
    "user_id" UUID NOT NULL,
    "address_id" UUID NOT NULL,
    "subtotal" DECIMAL NOT NULL,
    "cgst_amount" DECIMAL NOT NULL,
    "sgst_amount" DECIMAL NOT NULL,
    "igst_amount" DECIMAL NOT NULL,
    "total_amount" DECIMAL NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "razorpay_order_id" VARCHAR,
    "razorpay_payment_id" VARCHAR,
    "payment_status" "PaymentStatus" NOT NULL,
    "order_status" "OrderStatus" NOT NULL,
    "tracking_link" VARCHAR,
    "invoice_number" VARCHAR,
    "invoice_url" VARCHAR,
    "notes" TEXT,
    "dispatched_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "bulk_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bulk_order_items" (
    "id" UUID NOT NULL,
    "bulk_order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "product_name" VARCHAR NOT NULL,
    "variant_size" VARCHAR NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL NOT NULL,
    "total_price" DECIMAL NOT NULL,
    "hsn_code" VARCHAR NOT NULL,
    "gst_rate" DECIMAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bulk_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL,
    "invoice_number" VARCHAR NOT NULL,
    "bulk_order_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "buyer_name" VARCHAR NOT NULL,
    "buyer_company" VARCHAR NOT NULL,
    "buyer_gstin" VARCHAR NOT NULL,
    "buyer_address" TEXT NOT NULL,
    "seller_name" VARCHAR NOT NULL,
    "seller_gstin" VARCHAR NOT NULL,
    "seller_address" TEXT NOT NULL,
    "subtotal" DECIMAL NOT NULL,
    "cgst_amount" DECIMAL NOT NULL,
    "sgst_amount" DECIMAL NOT NULL,
    "igst_amount" DECIMAL NOT NULL,
    "total_amount" DECIMAL NOT NULL,
    "invoice_date" TIMESTAMP(6) NOT NULL,
    "pdf_url" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gstin_verifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "gstin" VARCHAR NOT NULL,
    "company_name" VARCHAR NOT NULL,
    "company_address" TEXT NOT NULL,
    "verification_status" "GstinVerificationStatus" NOT NULL,
    "api_response" JSONB,
    "verified_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gstin_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" UUID NOT NULL,
    "recipient_email" VARCHAR NOT NULL,
    "email_type" "EmailType" NOT NULL,
    "order_id" VARCHAR,
    "status" "EmailStatus" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" UUID NOT NULL,
    "event_type" VARCHAR NOT NULL,
    "user_id" UUID,
    "product_id" UUID,
    "order_id" VARCHAR,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_slug_idx" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "products_is_active_idx" ON "products"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "sample_orders_order_number_key" ON "sample_orders"("order_number");

-- CreateIndex
CREATE INDEX "sample_orders_order_number_idx" ON "sample_orders"("order_number");

-- CreateIndex
CREATE INDEX "sample_orders_email_idx" ON "sample_orders"("email");

-- CreateIndex
CREATE INDEX "sample_orders_payment_status_idx" ON "sample_orders"("payment_status");

-- CreateIndex
CREATE INDEX "sample_orders_order_status_idx" ON "sample_orders"("order_status");

-- CreateIndex
CREATE UNIQUE INDEX "bulk_orders_order_number_key" ON "bulk_orders"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "bulk_orders_invoice_number_key" ON "bulk_orders"("invoice_number");

-- CreateIndex
CREATE INDEX "bulk_orders_order_number_idx" ON "bulk_orders"("order_number");

-- CreateIndex
CREATE INDEX "bulk_orders_user_id_idx" ON "bulk_orders"("user_id");

-- CreateIndex
CREATE INDEX "bulk_orders_payment_status_idx" ON "bulk_orders"("payment_status");

-- CreateIndex
CREATE INDEX "bulk_orders_order_status_idx" ON "bulk_orders"("order_status");

-- CreateIndex
CREATE INDEX "bulk_order_items_bulk_order_id_idx" ON "bulk_order_items"("bulk_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_bulk_order_id_key" ON "invoices"("bulk_order_id");

-- CreateIndex
CREATE INDEX "cart_user_id_idx" ON "cart"("user_id");

-- CreateIndex
CREATE INDEX "analytics_events_event_type_idx" ON "analytics_events"("event_type");

-- CreateIndex
CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events"("created_at");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sample_orders" ADD CONSTRAINT "sample_orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sample_orders" ADD CONSTRAINT "sample_orders_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_orders" ADD CONSTRAINT "bulk_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_orders" ADD CONSTRAINT "bulk_orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_order_items" ADD CONSTRAINT "bulk_order_items_bulk_order_id_fkey" FOREIGN KEY ("bulk_order_id") REFERENCES "bulk_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_order_items" ADD CONSTRAINT "bulk_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_order_items" ADD CONSTRAINT "bulk_order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_bulk_order_id_fkey" FOREIGN KEY ("bulk_order_id") REFERENCES "bulk_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gstin_verifications" ADD CONSTRAINT "gstin_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
