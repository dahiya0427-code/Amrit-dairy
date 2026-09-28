import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_offers_discount_type" AS ENUM('percent', 'flat');
  CREATE TYPE "public"."enum_offers_applies_to" AS ENUM('all', 'categories', 'products');
  CREATE TYPE "public"."enum_coupons_type" AS ENUM('percent', 'flat', 'free_delivery');
  CREATE TYPE "public"."enum_coupons_applies_to" AS ENUM('all', 'categories', 'products');
  CREATE TABLE "offers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"discount_type" "enum_offers_discount_type" DEFAULT 'percent' NOT NULL,
  	"value" numeric NOT NULL,
  	"applies_to" "enum_offers_applies_to" DEFAULT 'all' NOT NULL,
  	"active" boolean DEFAULT true,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "offers_locales" (
  	"title" varchar NOT NULL,
  	"badge" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "offers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "coupons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"type" "enum_coupons_type" DEFAULT 'percent' NOT NULL,
  	"value" numeric,
  	"min_order" numeric,
  	"max_discount" numeric,
  	"applies_to" "enum_coupons_applies_to" DEFAULT 'all' NOT NULL,
  	"usage_limit" numeric,
  	"per_customer_limit" numeric,
  	"active" boolean DEFAULT true,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"used_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "coupons_locales" (
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "coupons_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"products_id" integer
  );
  
  ALTER TABLE "orders" ADD COLUMN "discount" numeric DEFAULT 0;
  ALTER TABLE "orders" ADD COLUMN "coupon_code" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "offers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "coupons_id" integer;
  ALTER TABLE "offers_locales" ADD CONSTRAINT "offers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_rels" ADD CONSTRAINT "offers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_rels" ADD CONSTRAINT "offers_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_rels" ADD CONSTRAINT "offers_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coupons_locales" ADD CONSTRAINT "coupons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coupons_rels" ADD CONSTRAINT "coupons_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coupons_rels" ADD CONSTRAINT "coupons_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coupons_rels" ADD CONSTRAINT "coupons_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "offers_updated_at_idx" ON "offers" USING btree ("updated_at");
  CREATE INDEX "offers_created_at_idx" ON "offers" USING btree ("created_at");
  CREATE UNIQUE INDEX "offers_locales_locale_parent_id_unique" ON "offers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "offers_rels_order_idx" ON "offers_rels" USING btree ("order");
  CREATE INDEX "offers_rels_parent_idx" ON "offers_rels" USING btree ("parent_id");
  CREATE INDEX "offers_rels_path_idx" ON "offers_rels" USING btree ("path");
  CREATE INDEX "offers_rels_categories_id_idx" ON "offers_rels" USING btree ("categories_id");
  CREATE INDEX "offers_rels_products_id_idx" ON "offers_rels" USING btree ("products_id");
  CREATE UNIQUE INDEX "coupons_code_idx" ON "coupons" USING btree ("code");
  CREATE INDEX "coupons_updated_at_idx" ON "coupons" USING btree ("updated_at");
  CREATE INDEX "coupons_created_at_idx" ON "coupons" USING btree ("created_at");
  CREATE UNIQUE INDEX "coupons_locales_locale_parent_id_unique" ON "coupons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "coupons_rels_order_idx" ON "coupons_rels" USING btree ("order");
  CREATE INDEX "coupons_rels_parent_idx" ON "coupons_rels" USING btree ("parent_id");
  CREATE INDEX "coupons_rels_path_idx" ON "coupons_rels" USING btree ("path");
  CREATE INDEX "coupons_rels_categories_id_idx" ON "coupons_rels" USING btree ("categories_id");
  CREATE INDEX "coupons_rels_products_id_idx" ON "coupons_rels" USING btree ("products_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offers_fk" FOREIGN KEY ("offers_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_coupons_fk" FOREIGN KEY ("coupons_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "orders_coupon_code_idx" ON "orders" USING btree ("coupon_code");
  CREATE INDEX "payload_locked_documents_rels_offers_id_idx" ON "payload_locked_documents_rels" USING btree ("offers_id");
  CREATE INDEX "payload_locked_documents_rels_coupons_id_idx" ON "payload_locked_documents_rels" USING btree ("coupons_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "offers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offers_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offers_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "coupons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "coupons_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "coupons_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "offers" CASCADE;
  DROP TABLE "offers_locales" CASCADE;
  DROP TABLE "offers_rels" CASCADE;
  DROP TABLE "coupons" CASCADE;
  DROP TABLE "coupons_locales" CASCADE;
  DROP TABLE "coupons_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_offers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_coupons_fk";
  
  DROP INDEX "orders_coupon_code_idx";
  DROP INDEX "payload_locked_documents_rels_offers_id_idx";
  DROP INDEX "payload_locked_documents_rels_coupons_id_idx";
  ALTER TABLE "orders" DROP COLUMN "discount";
  ALTER TABLE "orders" DROP COLUMN "coupon_code";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "offers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "coupons_id";
  DROP TYPE "public"."enum_offers_discount_type";
  DROP TYPE "public"."enum_offers_applies_to";
  DROP TYPE "public"."enum_coupons_type";
  DROP TYPE "public"."enum_coupons_applies_to";`)
}
