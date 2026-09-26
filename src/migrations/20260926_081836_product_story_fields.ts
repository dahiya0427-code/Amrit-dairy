import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_badges" AS ENUM('bilona', 'desi-cow', 'makkhan', 'glass', 'clay', 'small-batch', 'no-additives', 'fresh', 'ships', 'rajasthani');
  CREATE TYPE "public"."enum_products_story_slides" AS ENUM('bilona', 'process', 'compare', 'source', 'uses');
  CREATE TABLE "products_card_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "products_badges" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_badges",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_story_slides" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_story_slides",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ours" varchar NOT NULL,
  	"regular" varchar NOT NULL
  );
  
  CREATE TABLE "products_usage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "products_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "categories_pills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  ALTER TABLE "products" ADD COLUMN "cutout_id" integer;
  ALTER TABLE "products" ADD COLUMN "hover_image_id" integer;
  ALTER TABLE "categories" ADD COLUMN "banner_image_id" integer;
  ALTER TABLE "categories_locales" ADD COLUMN "tagline" varchar;
  ALTER TABLE "products_card_points" ADD CONSTRAINT "products_card_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_badges" ADD CONSTRAINT "products_badges_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_story_slides" ADD CONSTRAINT "products_story_slides_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_comparison" ADD CONSTRAINT "products_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_usage" ADD CONSTRAINT "products_usage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_benefits" ADD CONSTRAINT "products_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_pills" ADD CONSTRAINT "categories_pills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_card_points_order_idx" ON "products_card_points" USING btree ("_order");
  CREATE INDEX "products_card_points_parent_id_idx" ON "products_card_points" USING btree ("_parent_id");
  CREATE INDEX "products_card_points_locale_idx" ON "products_card_points" USING btree ("_locale");
  CREATE INDEX "products_badges_order_idx" ON "products_badges" USING btree ("order");
  CREATE INDEX "products_badges_parent_idx" ON "products_badges" USING btree ("parent_id");
  CREATE INDEX "products_story_slides_order_idx" ON "products_story_slides" USING btree ("order");
  CREATE INDEX "products_story_slides_parent_idx" ON "products_story_slides" USING btree ("parent_id");
  CREATE INDEX "products_comparison_order_idx" ON "products_comparison" USING btree ("_order");
  CREATE INDEX "products_comparison_parent_id_idx" ON "products_comparison" USING btree ("_parent_id");
  CREATE INDEX "products_comparison_locale_idx" ON "products_comparison" USING btree ("_locale");
  CREATE INDEX "products_usage_order_idx" ON "products_usage" USING btree ("_order");
  CREATE INDEX "products_usage_parent_id_idx" ON "products_usage" USING btree ("_parent_id");
  CREATE INDEX "products_usage_locale_idx" ON "products_usage" USING btree ("_locale");
  CREATE INDEX "products_benefits_order_idx" ON "products_benefits" USING btree ("_order");
  CREATE INDEX "products_benefits_parent_id_idx" ON "products_benefits" USING btree ("_parent_id");
  CREATE INDEX "products_benefits_locale_idx" ON "products_benefits" USING btree ("_locale");
  CREATE INDEX "categories_pills_order_idx" ON "categories_pills" USING btree ("_order");
  CREATE INDEX "categories_pills_parent_id_idx" ON "categories_pills" USING btree ("_parent_id");
  CREATE INDEX "categories_pills_locale_idx" ON "categories_pills" USING btree ("_locale");
  ALTER TABLE "products" ADD CONSTRAINT "products_cutout_id_media_id_fk" FOREIGN KEY ("cutout_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_hover_image_id_media_id_fk" FOREIGN KEY ("hover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_cutout_idx" ON "products" USING btree ("cutout_id");
  CREATE INDEX "products_hover_image_idx" ON "products" USING btree ("hover_image_id");
  CREATE INDEX "categories_banner_image_idx" ON "categories" USING btree ("banner_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_card_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_badges" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_story_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_comparison" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_usage" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_pills" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_card_points" CASCADE;
  DROP TABLE "products_badges" CASCADE;
  DROP TABLE "products_story_slides" CASCADE;
  DROP TABLE "products_comparison" CASCADE;
  DROP TABLE "products_usage" CASCADE;
  DROP TABLE "products_benefits" CASCADE;
  DROP TABLE "categories_pills" CASCADE;
  ALTER TABLE "products" DROP CONSTRAINT "products_cutout_id_media_id_fk";
  
  ALTER TABLE "products" DROP CONSTRAINT "products_hover_image_id_media_id_fk";
  
  ALTER TABLE "categories" DROP CONSTRAINT "categories_banner_image_id_media_id_fk";
  
  DROP INDEX "products_cutout_idx";
  DROP INDEX "products_hover_image_idx";
  DROP INDEX "categories_banner_image_idx";
  ALTER TABLE "products" DROP COLUMN "cutout_id";
  ALTER TABLE "products" DROP COLUMN "hover_image_id";
  ALTER TABLE "categories" DROP COLUMN "banner_image_id";
  ALTER TABLE "categories_locales" DROP COLUMN "tagline";
  DROP TYPE "public"."enum_products_badges";
  DROP TYPE "public"."enum_products_story_slides";`)
}
