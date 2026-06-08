-- CreateTable
CREATE TABLE "member_levels" (
    "id" BIGSERIAL NOT NULL,
    "level_code" VARCHAR(20) NOT NULL,
    "level_name" VARCHAR(50) NOT NULL,
    "level_rank" INTEGER NOT NULL,
    "min_growth_value" INTEGER NOT NULL DEFAULT 0,
    "max_growth_value" INTEGER NOT NULL DEFAULT 0,
    "icon_url" VARCHAR(500),
    "discount_rate" DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    "benefits" JSONB NOT NULL DEFAULT '{}',
    "points_multiplier" DECIMAL(4,2) NOT NULL DEFAULT 1.00,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "nickname" VARCHAR(50),
    "avatar_url" VARCHAR(500),
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "gender" INTEGER NOT NULL DEFAULT 0,
    "birthday" DATE,
    "member_level_id" BIGINT,
    "growth_value" INTEGER NOT NULL DEFAULT 0,
    "points_balance" INTEGER NOT NULL DEFAULT 0,
    "total_points_earned" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "last_login_at" TIMESTAMP(3),
    "last_login_ip" VARCHAR(50),
    "source_channel" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" BIGSERIAL NOT NULL,
    "parent_id" BIGINT NOT NULL DEFAULT 0,
    "name" VARCHAR(100) NOT NULL,
    "icon_url" VARCHAR(500),
    "image_url" VARCHAR(500),
    "level" INTEGER NOT NULL DEFAULT 1,
    "path" VARCHAR(500) NOT NULL DEFAULT '',
    "is_leaf" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_recommended" BOOLEAN NOT NULL DEFAULT false,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" BIGSERIAL NOT NULL,
    "spu_code" VARCHAR(50) NOT NULL,
    "category_id" BIGINT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "subtitle" VARCHAR(200),
    "keywords" VARCHAR(500),
    "main_image_url" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "detail_html" TEXT,
    "min_price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "max_price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_stock" INTEGER NOT NULL DEFAULT 0,
    "sales_count" INTEGER NOT NULL DEFAULT 0,
    "unit" VARCHAR(20) NOT NULL DEFAULT '件',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "onsale_status" INTEGER NOT NULL DEFAULT 0,
    "is_recommended" BOOLEAN NOT NULL DEFAULT false,
    "is_new" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_skus" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "sku_code" VARCHAR(100) NOT NULL,
    "sku_name" VARCHAR(200),
    "spec_info" JSONB NOT NULL DEFAULT '{}',
    "image_url" VARCHAR(500),
    "price" DECIMAL(12,2) NOT NULL,
    "original_price" DECIMAL(12,2),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "locked_stock" INTEGER NOT NULL DEFAULT 0,
    "weight" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_skus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "image_url" VARCHAR(500) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_cart" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "sku_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "is_selected" BOOLEAN NOT NULL DEFAULT true,
    "added_price" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shopping_cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" BIGSERIAL NOT NULL,
    "order_no" VARCHAR(32) NOT NULL,
    "user_id" BIGINT NOT NULL,
    "order_type" INTEGER NOT NULL DEFAULT 1,
    "status" VARCHAR(30) NOT NULL DEFAULT 'pending_pay',
    "total_product_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "freight_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "pay_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "points_used" INTEGER NOT NULL DEFAULT 0,
    "points_earned" INTEGER NOT NULL DEFAULT 0,
    "growth_value_earned" INTEGER NOT NULL DEFAULT 0,
    "coupon_discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "member_discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "payment_method" VARCHAR(30),
    "payment_no" VARCHAR(64),
    "payment_time" TIMESTAMP(3),
    "shipping_receiver_name" VARCHAR(50),
    "shipping_receiver_phone" VARCHAR(20),
    "shipping_province" VARCHAR(50),
    "shipping_city" VARCHAR(50),
    "shipping_district" VARCHAR(50),
    "shipping_detail" VARCHAR(500),
    "shipping_company" VARCHAR(50),
    "shipping_no" VARCHAR(50),
    "shipping_time" TIMESTAMP(3),
    "receive_time" TIMESTAMP(3),
    "cancel_reason" VARCHAR(500),
    "cancel_time" TIMESTAMP(3),
    "buyer_remark" VARCHAR(500),
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "order_no" VARCHAR(32) NOT NULL,
    "product_id" BIGINT NOT NULL,
    "sku_id" BIGINT NOT NULL,
    "product_name" VARCHAR(200) NOT NULL,
    "product_image_url" VARCHAR(500),
    "sku_spec_snapshot" JSONB,
    "price" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_logs" (
    "id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "order_no" VARCHAR(32) NOT NULL,
    "from_status" VARCHAR(30),
    "to_status" VARCHAR(30) NOT NULL,
    "operator_id" BIGINT,
    "operator_type" VARCHAR(20) NOT NULL DEFAULT 'system',
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_addresses" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "receiver_name" VARCHAR(50) NOT NULL,
    "receiver_phone" VARCHAR(20) NOT NULL,
    "province" VARCHAR(50) NOT NULL,
    "province_code" VARCHAR(20),
    "city" VARCHAR(50) NOT NULL,
    "city_code" VARCHAR(20),
    "district" VARCHAR(50) NOT NULL,
    "district_code" VARCHAR(20),
    "detail_address" VARCHAR(500) NOT NULL,
    "postal_code" VARCHAR(10),
    "address_tag" VARCHAR(20) NOT NULL DEFAULT 'home',
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "longitude" DECIMAL(10,7),
    "latitude" DECIMAL(10,7),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sign_in_records" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "sign_date" DATE NOT NULL,
    "consecutive_days" INTEGER NOT NULL DEFAULT 1,
    "points_earned" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sign_in_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "points_accounts" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "total_earned" INTEGER NOT NULL DEFAULT 0,
    "total_spent" INTEGER NOT NULL DEFAULT 0,
    "total_expired" INTEGER NOT NULL DEFAULT 0,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "frozen_points" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "points_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" BIGSERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "image_url" VARCHAR(500) NOT NULL,
    "link_type" VARCHAR(20) NOT NULL DEFAULT 'none',
    "link_value" VARCHAR(500),
    "position" VARCHAR(30) NOT NULL DEFAULT 'home',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" BIGSERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "type" VARCHAR(20) NOT NULL DEFAULT 'notice',
    "is_top" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "publish_time" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigations" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "icon_url" VARCHAR(500),
    "link_type" VARCHAR(20) NOT NULL DEFAULT 'none',
    "link_value" VARCHAR(500),
    "parent_id" BIGINT NOT NULL DEFAULT 0,
    "position" VARCHAR(30) NOT NULL DEFAULT 'home',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navigations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_levels_level_code_key" ON "member_levels"("level_code");

-- CreateIndex
CREATE UNIQUE INDEX "member_levels_level_rank_key" ON "member_levels"("level_rank");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_member_level_id_idx" ON "users"("member_level_id");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE INDEX "categories_status_sort_order_idx" ON "categories"("status", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "products_spu_code_key" ON "products"("spu_code");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "products_onsale_status_idx" ON "products"("onsale_status");

-- CreateIndex
CREATE UNIQUE INDEX "product_skus_sku_code_key" ON "product_skus"("sku_code");

-- CreateIndex
CREATE INDEX "product_skus_product_id_idx" ON "product_skus"("product_id");

-- CreateIndex
CREATE INDEX "product_images_product_id_idx" ON "product_images"("product_id");

-- CreateIndex
CREATE INDEX "shopping_cart_user_id_idx" ON "shopping_cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_cart_user_id_sku_id_key" ON "shopping_cart"("user_id", "sku_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_no_key" ON "orders"("order_no");

-- CreateIndex
CREATE INDEX "orders_user_id_status_idx" ON "orders"("user_id", "status");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "order_items_order_no_idx" ON "order_items"("order_no");

-- CreateIndex
CREATE INDEX "order_status_logs_order_id_idx" ON "order_status_logs"("order_id");

-- CreateIndex
CREATE INDEX "user_addresses_user_id_idx" ON "user_addresses"("user_id");

-- CreateIndex
CREATE INDEX "sign_in_records_user_id_idx" ON "sign_in_records"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "sign_in_records_user_id_sign_date_key" ON "sign_in_records"("user_id", "sign_date");

-- CreateIndex
CREATE UNIQUE INDEX "points_accounts_user_id_key" ON "points_accounts"("user_id");

-- CreateIndex
CREATE INDEX "banners_position_is_enabled_idx" ON "banners"("position", "is_enabled");

-- CreateIndex
CREATE INDEX "announcements_type_is_enabled_idx" ON "announcements"("type", "is_enabled");

-- CreateIndex
CREATE INDEX "navigations_position_is_enabled_idx" ON "navigations"("position", "is_enabled");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_member_level_id_fkey" FOREIGN KEY ("member_level_id") REFERENCES "member_levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_skus" ADD CONSTRAINT "product_skus_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "product_skus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "product_skus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_logs" ADD CONSTRAINT "order_status_logs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sign_in_records" ADD CONSTRAINT "sign_in_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points_accounts" ADD CONSTRAINT "points_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
