import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { addStarterAdditions } from '../seed/additions'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_testimonials_source" AS ENUM('website', 'whatsapp', 'google', 'in-person');
  CREATE TYPE "public"."enum_adoption_plans_period" AS ENUM('month', 'year', 'once');
  CREATE TYPE "public"."enum_adoptions_status" AS ENUM('new', 'contacted', 'active', 'ended');
  CREATE TABLE "products_bundle" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"quantity" numeric DEFAULT 1 NOT NULL
  );
  
  CREATE TABLE "products_bundle_locales" (
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "adoption_plans_perks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "adoption_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"price" numeric NOT NULL,
  	"period" "enum_adoption_plans_period" DEFAULT 'month' NOT NULL,
  	"highlight" boolean DEFAULT false,
  	"active" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "adoption_plans_locales" (
  	"name" varchar NOT NULL,
  	"tagline" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "adoptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"city" varchar,
  	"plan_id" integer,
  	"plan_snapshot" varchar,
  	"cow" varchar,
  	"is_gift" boolean,
  	"gift_for" varchar,
  	"occasion" varchar,
  	"message" varchar,
  	"status" "enum_adoptions_status" DEFAULT 'new',
  	"internal_notes" varchar,
  	"locale" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "testimonials" ALTER COLUMN "rating" SET NOT NULL;
  ALTER TABLE "products_variants" ADD COLUMN "stock" numeric;
  ALTER TABLE "testimonials" ADD COLUMN "photo_id" integer;
  ALTER TABLE "testimonials" ADD COLUMN "verified" boolean DEFAULT false;
  ALTER TABLE "testimonials" ADD COLUMN "source" "enum_testimonials_source" DEFAULT 'website';
  ALTER TABLE "testimonials" ADD COLUMN "phone" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "adoption_plans_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "adoptions_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "low_stock_threshold" numeric DEFAULT 5;
  ALTER TABLE "products_bundle" ADD CONSTRAINT "products_bundle_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_bundle" ADD CONSTRAINT "products_bundle_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_bundle_locales" ADD CONSTRAINT "products_bundle_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_bundle"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "adoption_plans_perks" ADD CONSTRAINT "adoption_plans_perks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."adoption_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "adoption_plans_locales" ADD CONSTRAINT "adoption_plans_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."adoption_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_plan_id_adoption_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."adoption_plans"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_bundle_order_idx" ON "products_bundle" USING btree ("_order");
  CREATE INDEX "products_bundle_parent_id_idx" ON "products_bundle" USING btree ("_parent_id");
  CREATE INDEX "products_bundle_product_idx" ON "products_bundle" USING btree ("product_id");
  CREATE UNIQUE INDEX "products_bundle_locales_locale_parent_id_unique" ON "products_bundle_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "adoption_plans_perks_order_idx" ON "adoption_plans_perks" USING btree ("_order");
  CREATE INDEX "adoption_plans_perks_parent_id_idx" ON "adoption_plans_perks" USING btree ("_parent_id");
  CREATE INDEX "adoption_plans_perks_locale_idx" ON "adoption_plans_perks" USING btree ("_locale");
  CREATE INDEX "adoption_plans_updated_at_idx" ON "adoption_plans" USING btree ("updated_at");
  CREATE INDEX "adoption_plans_created_at_idx" ON "adoption_plans" USING btree ("created_at");
  CREATE UNIQUE INDEX "adoption_plans_locales_locale_parent_id_unique" ON "adoption_plans_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "adoptions_plan_idx" ON "adoptions" USING btree ("plan_id");
  CREATE INDEX "adoptions_updated_at_idx" ON "adoptions" USING btree ("updated_at");
  CREATE INDEX "adoptions_created_at_idx" ON "adoptions" USING btree ("created_at");
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_adoption_plans_fk" FOREIGN KEY ("adoption_plans_id") REFERENCES "public"."adoption_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_adoptions_fk" FOREIGN KEY ("adoptions_id") REFERENCES "public"."adoptions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "payload_locked_documents_rels_adoption_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("adoption_plans_id");
  CREATE INDEX "payload_locked_documents_rels_adoptions_id_idx" ON "payload_locked_documents_rels" USING btree ("adoptions_id");`)

  // Live sites: add the Ghee & Honey Gift Box and the Adopt-a-Cow plans (skipped on a
  // brand-new database, where the seed adds them after creating the catalogue)
  await addStarterAdditions(payload, req)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_bundle" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_bundle_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "adoption_plans_perks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "adoption_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "adoption_plans_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "adoptions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_bundle" CASCADE;
  DROP TABLE "products_bundle_locales" CASCADE;
  DROP TABLE "adoption_plans_perks" CASCADE;
  DROP TABLE "adoption_plans" CASCADE;
  DROP TABLE "adoption_plans_locales" CASCADE;
  DROP TABLE "adoptions" CASCADE;
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_photo_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_adoption_plans_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_adoptions_fk";
  
  DROP INDEX "testimonials_photo_idx";
  DROP INDEX "payload_locked_documents_rels_adoption_plans_id_idx";
  DROP INDEX "payload_locked_documents_rels_adoptions_id_idx";
  ALTER TABLE "testimonials" ALTER COLUMN "rating" DROP NOT NULL;
  ALTER TABLE "products_variants" DROP COLUMN "stock";
  ALTER TABLE "testimonials" DROP COLUMN "photo_id";
  ALTER TABLE "testimonials" DROP COLUMN "verified";
  ALTER TABLE "testimonials" DROP COLUMN "source";
  ALTER TABLE "testimonials" DROP COLUMN "phone";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "adoption_plans_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "adoptions_id";
  ALTER TABLE "site_settings" DROP COLUMN "low_stock_threshold";
  DROP TYPE "public"."enum_testimonials_source";
  DROP TYPE "public"."enum_adoption_plans_period";
  DROP TYPE "public"."enum_adoptions_status";`)
}
